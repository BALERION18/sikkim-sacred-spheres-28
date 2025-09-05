import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { User, Calendar, Shield, CheckCircle, XCircle } from "lucide-react";

interface UserProfile {
  id: string;
  display_name: string;
  full_name: string;
  created_at: string;
  kyc_status: string;
  role?: string;
}

export const AdminUserManager = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id,
          display_name,
          full_name,
          created_at,
          kyc_status
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Fetch roles for each user
      const usersWithRoles = await Promise.all(
        (data || []).map(async (user) => {
          const { data: roleData } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', user.id)
            .single();
          
          return {
            ...user,
            role: roleData?.role || 'user'
          };
        })
      );
      
      setUsers(usersWithRoles);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateKycStatus = async (userId: string, status: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ kyc_status: status })
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: "KYC Status Updated",
        description: `KYC has been ${status}`,
      });

      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, kyc_status: status } : user
      ));
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update KYC status",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-8">
            <p className="text-muted-foreground">Loading users...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Management</CardTitle>
      </CardHeader>
      <CardContent>
        {users.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <User className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>No users found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {users.map((user) => (
              <div key={user.id} className="border border-border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-lg">
                        {user.display_name || user.full_name || 'Unnamed User'}
                      </h3>
                      <Badge variant={
                        user.role === 'admin' ? 'destructive' : 
                        user.role === 'guide' ? 'default' : 'secondary'
                      }>
                        <Shield className="w-3 h-3 mr-1" />
                        {user.role || 'user'}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-2">
                      <span className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        Joined {new Date(user.created_at).toLocaleDateString()}
                      </span>
                      <span className="flex items-center">
                        <User className="w-4 h-4 mr-1" />
                        ID: {user.id.slice(0, 8)}...
                      </span>
                    </div>
                    
                    {user.role === 'guide' && (
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium">KYC Status:</span>
                        <Badge variant={
                          user.kyc_status === 'approved' ? 'default' : 
                          user.kyc_status === 'rejected' ? 'destructive' : 'secondary'
                        }>
                          {user.kyc_status || 'pending'}
                        </Badge>
                      </div>
                    )}
                  </div>
                  
                  {user.role === 'guide' && user.kyc_status === 'pending' && (
                    <div className="flex items-center space-x-2 ml-4">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => updateKycStatus(user.id, 'approved')}
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Approve
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => updateKycStatus(user.id, 'rejected')}
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};