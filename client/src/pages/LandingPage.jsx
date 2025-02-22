import React from "react";
import { Button } from "@/components/ui/button";

const LandingPage = () => {
  const handleGetStarted = () => {
    // Add registration/get started logic here
  };

  const handleViewEvents = () => {
    // Add event listing logic here

  };

  const handleCreateEvent = () => {
    // Add event creation logic here

  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Welcome to Event Hub</h2>
          <p className="mb-4">
            Manage your events efficiently with our simple platform.
          </p>
          <Button onClick={handleGetStarted}>Get Started</Button>
        </section>

        {/* Quick Actions */}
        <section className="mb-8">
          <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
          <div className="flex gap-4">
            <Button variant="outline" onClick={handleViewEvents}>
              View Events
            </Button>
            <Button onClick={handleCreateEvent}>Create Event</Button>
          </div>
        </section>

        {/* Features List */}
        <section>
          <h3 className="text-xl font-bold mb-4">Features</h3>
          <ul className="space-y-2">
            <li>• Create and manage events</li>
            <li>• Track registrations</li>
            <li>• Send invitations</li>
            <li>• Generate reports</li>
          </ul>
        </section>
      </main>
    </div>
  );
};

export default LandingPage;
