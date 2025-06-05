
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { UserCircle, Bell, ShieldCheck } from "lucide-react";

const userSettings = {
  name: "Demo User",
  email: "demo@example.com",
  notifications: {
    email: true,
    push: false,
  },
  theme: "light", 
};

const cardHoverEffect = "transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-1 hover:shadow-primary/20 border border-border hover:border-primary/30";

export default function SettingsPage() {
  return (
    <div className="container mx-auto py-8 max-w-3xl">
      <h1 className="text-3xl sm:text-4xl font-headline font-bold mb-10">
         <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-secondary-foreground">
          Settings
        </span>
      </h1>

      <Card className={`mb-8 ${cardHoverEffect}`}>
        <CardHeader>
          <CardTitle className="font-headline text-xl flex items-center gap-2">
            <UserCircle className="h-6 w-6 text-primary/80" />
            Profile Information
          </CardTitle>
          <CardDescription>Manage your personal details.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" defaultValue={userSettings.name} className="text-base"/>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" type="email" defaultValue={userSettings.email} disabled className="text-base"/>
            <p className="text-xs text-muted-foreground mt-1">Email cannot be changed.</p>
          </div>
          <Button className="shadow-lg hover:shadow-primary/40">Update Profile</Button>
        </CardContent>
      </Card>

      <Card className={`mb-8 ${cardHoverEffect}`}>
        <CardHeader>
          <CardTitle className="font-headline text-xl flex items-center gap-2">
            <Bell className="h-6 w-6 text-primary/80" />
            Notification Preferences
          </CardTitle>
          <CardDescription>Choose how you want to be notified.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
            <Label htmlFor="email-notifications" className="flex flex-col space-y-1 cursor-pointer">
              <span>Email Notifications</span>
              <span className="font-normal leading-snug text-muted-foreground text-sm">
                Receive important updates and alerts via email.
              </span>
            </Label>
            <Switch
              id="email-notifications"
              defaultChecked={userSettings.notifications.email}
              aria-label="Email notifications"
            />
          </div>
          <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
            <Label htmlFor="push-notifications" className="flex flex-col space-y-1 cursor-pointer">
              <span>Push Notifications</span>
              <span className="font-normal leading-snug text-muted-foreground text-sm">
                Get real-time alerts on your mobile device (if app supported).
              </span>
            </Label>
            <Switch
              id="push-notifications"
              defaultChecked={userSettings.notifications.push}
              aria-label="Push notifications"
            />
          </div>
          <Button className="shadow-lg hover:shadow-primary/40">Save Preferences</Button>
        </CardContent>
      </Card>
      
      <Card className={cardHoverEffect}>
        <CardHeader>
          <CardTitle className="font-headline text-xl flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-primary/80" />
            Security
          </CardTitle>
          <CardDescription>Manage your account security settings.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
           <div>
            <Button variant="outline" className="w-full sm:w-auto shadow-sm hover:shadow-accent/30">Change Password</Button>
           </div>
           <div>
            <Button variant="outline" className="w-full sm:w-auto shadow-sm hover:shadow-accent/30">Enable Two-Factor Authentication</Button>
           </div>
        </CardContent>
      </Card>
    </div>
  );
}
