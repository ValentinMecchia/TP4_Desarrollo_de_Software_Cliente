import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function SettingsPage() {
  // Mock user data - replace with data from useAuth or API
  const userSettings = {
    name: "Demo User",
    email: "demo@example.com",
    notifications: {
      email: true,
      push: false,
    },
    theme: "light", // 'light', 'dark', 'system'
  };

  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <h1 className="text-3xl font-headline font-bold mb-8 text-primary">Settings</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="font-headline">Profile Information</CardTitle>
          <CardDescription>Manage your personal details.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" defaultValue={userSettings.name} />
          </div>
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" type="email" defaultValue={userSettings.email} disabled />
            <p className="text-xs text-muted-foreground mt-1">Email cannot be changed here.</p>
          </div>
          <Button>Update Profile</Button>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="font-headline">Notification Preferences</CardTitle>
          <CardDescription>Choose how you want to be notified.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="email-notifications" className="flex flex-col space-y-1">
              <span>Email Notifications</span>
              <span className="font-normal leading-snug text-muted-foreground">
                Receive important updates and alerts via email.
              </span>
            </Label>
            <Switch
              id="email-notifications"
              defaultChecked={userSettings.notifications.email}
              aria-label="Email notifications"
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="push-notifications" className="flex flex-col space-y-1">
              <span>Push Notifications</span>
              <span className="font-normal leading-snug text-muted-foreground">
                Get real-time alerts on your mobile device (if app supported).
              </span>
            </Label>
            <Switch
              id="push-notifications"
              defaultChecked={userSettings.notifications.push}
              aria-label="Push notifications"
            />
          </div>
          <Button>Save Preferences</Button>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Security</CardTitle>
          <CardDescription>Manage your account security settings.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
           <div>
            <Button variant="outline">Change Password</Button>
           </div>
           <div>
            <Button variant="outline">Enable Two-Factor Authentication</Button>
           </div>
        </CardContent>
      </Card>
    </div>
  );
}
