import { useState } from 'react';
import { Navbar } from '../components/navigation/Navbar';
import { Card } from '@/components/ui';
import { User, LogOut } from 'lucide-react';

interface Address {
  id: number;
  type: 'home' | 'work';
  street: string;
  city: string;
  state: string;
  zip: string;
  default: boolean;
}

const initialAddress: Address = { id: 1, type: 'home', street: '123 Main St', city: 'City', state: 'State', zip: '12345', default: true };

const initialUser = { id: 1, email: 'user@shopsphere.com', firstName: 'John', lastName: 'Doe', role: 'CUSTOMER' };

export const ProfilePage = () => {
  const [user, setUser] = useState(initialUser);
  const [addresses, setAddresses] = useState<Address[]>([initialAddress]);
  const [isEditing, setIsEditing] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleSave = () => setIsEditing(false);
  const handleDeleteAddress = (id: number) => setAddresses((items) => items.filter((address) => address.id !== id));
  const handleLogout = () => setShowLogoutModal(true);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 space-y-8">
          <Card className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-border/50 flex items-center justify-center"><User className="h-8 w-8 text-primary" /></div>
              <div><h2 className="text-xl font-bold text-foreground">{user.firstName} {user.lastName}</h2><p className="text-muted">{user.email}</p></div>
            </div>
            <div className="mt-4 flex items-center gap-2"><span className="text-sm text-muted">Member since Sep 2024</span><span className="text-sm font-medium text-primary">{user.role}</span></div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">My Addresses</h2>
            {addresses.length === 0 ? <p className="text-muted">No addresses saved.</p> : (
              <div className="space-y-3">
                {addresses.map((address) => (
                  <div key={address.id} className={`flex items-center gap-3 p-3 rounded-lg ${address.default ? 'bg-primary/5 border border-primary' : 'bg-background'}`}>
                    <span className={`w-2 h-2 rounded-full ${address.default ? 'bg-primary' : 'bg-muted'}`} />
                    <span className="flex-1 text-sm">{address.street}, {address.city}, {address.state} {address.zip}</span>
                    {address.default && <span className="text-xs text-primary">Default</span>}
                    <button type="button" onClick={() => handleDeleteAddress(address.id)} className="text-xs text-destructive hover:underline">Remove</button>
                  </div>
                ))}
              </div>
            )}
            <button type="button" onClick={() => setIsEditing(true)} className="w-full mt-4 px-4 py-2 bg-primary text-primary-foreground rounded">Edit Profile</button>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">Account Settings</h2>
            <div className="space-y-4">
              <div><label className="block text-sm font-medium mb-2">Email</label><input type="email" value={user.email} readOnly className="w-full rounded-lg border border-border px-3 py-2" /></div>
              <div><label className="block text-sm font-medium mb-2">First Name</label><input type="text" value={user.firstName} disabled={!isEditing} onChange={(e) => setUser((current) => ({ ...current, firstName: e.target.value }))} className="w-full rounded-lg border border-border px-3 py-2" /></div>
              {isEditing && <button type="button" onClick={handleSave} className="w-full px-4 py-2 bg-primary text-primary-foreground rounded">Save Changes</button>}
              <button type="button" onClick={handleLogout} className="w-full inline-flex items-center justify-center px-4 py-2 bg-destructive text-destructive-foreground rounded"><LogOut className="h-4 w-4 mr-2" />Logout</button>
            </div>
          </Card>
        </div>
      </main>

      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-8 max-w-sm w-full shadow-lg">
            <h2 className="text-xl font-bold mb-4">Logout</h2>
            <p className="text-muted mb-6">Are you sure you want to logout?</p>
            <div className="flex gap-3">
              <button type="button" onClick={() => setShowLogoutModal(false)} className="flex-1 px-4 py-2 border rounded">Cancel</button>
              <button type="button" onClick={() => { localStorage.removeItem('shopSphereToken'); window.location.href = '/login'; }} className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded">Logout</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
