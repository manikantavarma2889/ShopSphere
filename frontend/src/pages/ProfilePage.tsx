import React, { useState } from 'react';
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

export const ProfilePage = React.memo(() => {
  const [user] = useState(initialUser);
  const [addresses, setAddresses] = useState<Address[]>([initialAddress]);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleDeleteAddress = (id: number) => setAddresses(addresses.filter(a => a.id !== id));
  const handleLogout = () => setShowLogoutModal(true);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4">
          <Card className="p-6 mb-8">
            <div className="flex items-center gap-4 mb-4"><div className="w-16 h-16 rounded-full bg-border/50 flex items-center justify-center flex-shrink-0"><User className="h-8 w-8 text-primary" /></div><div><h2 className="text-xl font-bold text-foreground">John Doe</h2><p className="text-muted">john.doe@shopsphere.com</p></div></div>
            <div className="mt-4 flex items-center gap-2"><span className="text-sm text-muted">Member since Sep 2024</span><span className="text-sm font-medium text-primary">CUSTOMER</span></div>
          </Card>
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">My Addresses</h2>
            {addresses.length === 0 ? <p className="text-muted">No addresses saved. Add a new address.</p> : <div className="space-y-3">{addresses.map((address) => <div key={address.id} className={`flex items-center gap-3 p-3 rounded-lg ${address.default ? 'bg-primary/5 border-primary' : 'bg-background'}`}><span className={`w-2 h-2 rounded-full ${address.default ? 'bg-primary' : 'bg-muted'}`} /><span className="flex-1 text-sm text-foreground">{address.street}, {address.city}, {address.state} {address.zip}</span>{address.default && <span className="text-xs text-primary">Default</span>}<button onClick={() => handleDeleteAddress(address.id)} className="text-xs text-destructive hover:underline">Remove</button></div>)}</div>}
            <button className="w-full mt-4 inline-flex items-center justify-center px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors">Add New Address</button>
          </Card>
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">Account Settings</h2>
            <div className="space-y-4">
              <div><label className="block text-sm font-medium text-foreground mb-2">Email</label><input type="email" value={user.email} readOnly className="w-full rounded-lg border-border px-3 py-2" /></div>
              <div><label className="block text-sm font-medium text-foreground mb-2">Full Name</label><input type="text" value={user.firstName} readOnly className="w-full rounded-lg border-border px-3 py-2" /></div>
              <button onClick={handleLogout} className="w-full inline-flex items-center justify-center px-4 py-2 bg-destructive text-destructive-foreground rounded hover:bg-destructive/90 transition-colors"><LogOut className="h-4 w-4 mr-2" />Logout</button>
            </div>
          </Card>
        </div>
      </main>
      {showLogoutModal && <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center"><div className="bg-white rounded-lg p-8 max-w-sm w-full shadow-lg"><h2 className="text-xl font-bold text-foreground mb-4">Logout</h2><p className="text-muted mb-6">Are you sure you want to logout?</p><div className="flex gap-3"><button onClick={() => setShowLogoutModal(false)} className="flex-1 px-4 py-2 border-border rounded hover:bg-gray-100">Cancel</button><button onClick={() => { window.location.href = '/'; }} className="w-full px-4 py-3 bg-primary text-primary-foreground rounded">Logout</button></div></div></div>}
    </div>
  );
});
