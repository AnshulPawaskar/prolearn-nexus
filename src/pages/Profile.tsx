import Navigation from '@/components/layout/Navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Edit3, Camera } from 'lucide-react';
import { useEffect, useState } from 'react';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);
  const [editData, setEditData] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [editError, setEditError] = useState('');

  useEffect(() => {
    const storedProfile = localStorage.getItem('profile');
    if (storedProfile) {
      setProfileData(JSON.parse(storedProfile));
      setEditData(JSON.parse(storedProfile));
    }
  }, []);

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    setEditError('');
    try {
      const token = localStorage.getItem('token');
      // Prepare payload as per Register schema
      const payload = {
        jwt: token,
        first_name: editData.first_name,
        last_name: editData.last_name,
        email: editData.email,
        years_of_experience: Number(editData.years_of_experience),
        age: Number(editData.age),
        position: editData.position,
        domain: editData.domain,
        department: editData.department,
        qualification: editData.qualification,
        profile_image: ''
      };

      // Edit profile API
      const res = await fetch('https://sbiu.shastrarth.in/user/edit_profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to update profile');

      // Fetch updated profile
      const profileRes = await fetch('https://sbiu.shastrarth.in/user/view_profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jwt: token }),
      });
      if (!profileRes.ok) throw new Error('Failed to fetch updated profile');
      const profile = await profileRes.json();

      localStorage.setItem('profile', JSON.stringify(profile.Success));
      setProfileData(profile.Success);
      setIsEditing(false);
    } catch (err: any) {
      setEditError(err.message || 'Profile update failed');
    } finally {
      setLoading(false);
    }
  };

  if (!profileData) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-fade-in">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-2 max-w-md">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Card */}
                <div className="lg:col-span-1">
                  <Card>
                    <CardContent className="p-6">
                      <div className="text-center">
                        <div className="relative inline-block mb-4">
                          <div className="w-24 h-24 bg-gradient-primary rounded-full flex items-center justify-center text-white text-2xl font-bold">
                            {(profileData.first_name?.[0] || '') + (profileData.last_name?.[0] || '')}
                          </div>
                          <Button 
                            size="sm" 
                            variant="secondary"
                            className="absolute bottom-0 right-0 rounded-full w-8 h-8 p-0"
                          >
                            <Camera className="w-4 h-4" />
                          </Button>
                        </div>
                          <div>
                            <h2 className="text-xl font-bold mb-1">{profileData.username}</h2>
                            <p className="text-sm text-muted-foreground mb-3">{profileData.email}</p>
                            <p className="text-sm mb-4">{profileData.position}, {profileData.department}</p>
                          </div>
                      </div>
                    </CardContent>
                  </Card>

                </div>

                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Profile Details */}
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle>Profile Details</CardTitle>
                        <CardDescription>Your personal and professional information</CardDescription>
                      </div>
                      {!isEditing && (
                        <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>
                          <Edit3 className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                      )}
                    </CardHeader>
                    
                    <CardContent>
                      {isEditing ? (
                        <div className="space-y-6">
                          {/* Personal Information */}
                          <div>
                            <h4 className="text-sm font-medium text-muted-foreground mb-3">Personal Information</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <label className="text-sm font-medium">First Name</label>
                                <Input
                                  name="first_name"
                                  value={editData.first_name || ''}
                                  onChange={handleEditChange}
                                  placeholder="Enter first name"
                                />
                              </div>
                              <div className="space-y-2">
                                <label className="text-sm font-medium">Last Name</label>
                                <Input
                                  name="last_name"
                                  value={editData.last_name || ''}
                                  onChange={handleEditChange}
                                  placeholder="Enter last name"
                                />
                              </div>
                              <div className="space-y-2">
                                <label className="text-sm font-medium">Email</label>
                                <Input
                                  name="email"
                                  type="email"
                                  value={editData.email || ''}
                                  onChange={handleEditChange}
                                  placeholder="Enter email address"
                                />
                              </div>
                              <div className="space-y-2">
                                <label className="text-sm font-medium">Age</label>
                                <Input
                                  name="age"
                                  type="number"
                                  value={editData.age || ''}
                                  onChange={handleEditChange}
                                  placeholder="Enter age"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Professional Information */}
                          <div>
                            <h4 className="text-sm font-medium text-muted-foreground mb-3">Professional Information</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <label className="text-sm font-medium">Position</label>
                                <Input
                                  name="position"
                                  value={editData.position || ''}
                                  onChange={handleEditChange}
                                  placeholder="Enter job position"
                                />
                              </div>
                              <div className="space-y-2">
                                <label className="text-sm font-medium">Department</label>
                                <Input
                                  name="department"
                                  value={editData.department || ''}
                                  onChange={handleEditChange}
                                  placeholder="Enter department"
                                />
                              </div>
                              <div className="space-y-2">
                                <label className="text-sm font-medium">Domain</label>
                                <Input
                                  name="domain"
                                  value={editData.domain || ''}
                                  onChange={handleEditChange}
                                  placeholder="Enter domain/field"
                                />
                              </div>
                              <div className="space-y-2">
                                <label className="text-sm font-medium">Years of Experience</label>
                                <Input
                                  name="years_of_experience"
                                  type="number"
                                  value={editData.years_of_experience || ''}
                                  onChange={handleEditChange}
                                  placeholder="Enter years of experience"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Education */}
                          <div>
                            <h4 className="text-sm font-medium text-muted-foreground mb-3">Education</h4>
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Qualification</label>
                              <Input
                                name="qualification"
                                value={editData.qualification || ''}
                                onChange={handleEditChange}
                                placeholder="Enter qualification"
                              />
                            </div>
                          </div>

                          {editError && (
                            <div className="text-destructive text-sm bg-destructive/10 p-3 rounded-md">
                              {editError}
                            </div>
                          )}

                          <div className="flex justify-end space-x-2 pt-4 border-t">
                            <Button variant="outline" onClick={() => setIsEditing(false)} disabled={loading}>
                              Cancel
                            </Button>
                            <Button onClick={handleSaveProfile} disabled={loading}>
                              {loading ? 'Saving...' : 'Save Changes'}
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          {/* Personal Information */}
                          <div>
                            <h4 className="text-sm font-medium text-muted-foreground mb-3">Personal Information</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Full Name</p>
                                <p className="font-medium">
                                  {profileData.first_name} {profileData.last_name}
                                </p>
                              </div>
                              <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Email</p>
                                <p className="font-medium">{profileData.email}</p>
                              </div>
                              <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Age</p>
                                <p className="font-medium">{profileData.age} years</p>
                              </div>
                            </div>
                          </div>

                          {/* Professional Information */}
                          <div>
                            <h4 className="text-sm font-medium text-muted-foreground mb-3">Professional Information</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Position</p>
                                <p className="font-medium">{profileData.position}</p>
                              </div>
                              <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Department</p>
                                <p className="font-medium">{profileData.department}</p>
                              </div>
                              <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Domain</p>
                                <p className="font-medium">{profileData.domain}</p>
                              </div>
                              <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Experience</p>
                                <p className="font-medium">{profileData.years_of_experience} years</p>
                              </div>
                            </div>
                          </div>

                          {/* Education */}
                          <div>
                            <h4 className="text-sm font-medium text-muted-foreground mb-3">Education</h4>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Qualification</p>
                              <p className="font-medium">{profileData.qualification}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Recent Activity */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Activity</CardTitle>
                      <CardDescription>Your latest learning milestones</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-success rounded-full mt-2" />
                          <div>
                            <p className="text-sm font-medium">Completed "Advanced React Patterns"</p>
                            <p className="text-xs text-muted-foreground">2 hours ago</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                          <div>
                            <p className="text-sm font-medium">Started "Data Visualization Module"</p>
                            <p className="text-xs text-muted-foreground">1 day ago</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-accent rounded-full mt-2" />
                          <div>
                            <p className="text-sm font-medium">Earned "Learning Streak" badge</p>
                            <p className="text-xs text-muted-foreground">3 days ago</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="settings" className="mt-8">
              <div className="space-y-6">
                {/* Privacy Settings */}
                <Card>
                  <CardHeader>
                    <CardTitle>Privacy & Security</CardTitle>
                    <CardDescription>Manage your privacy and security settings</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button variant="outline" className="w-full justify-start">
                      {/* <Shield className="w-4 h-4 mr-2" /> */}
                      Change Password
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Profile;