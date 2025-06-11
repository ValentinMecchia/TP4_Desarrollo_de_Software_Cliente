
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

      
      
      
    </div>
  );
}
