import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarIcon, MapPinIcon, ArrowRightIcon } from "lucide-react";
import EventCard from "@/components/EventCard";
import FeatureStep from "@/components/FeatureStep";

const LandingPage = () => {
  // Sample event data
  const featuredEvents = [
    {
      id: 1,
      title: "Music Festival",
      date: "August 15, 2023",
      location: "San Francisco, CA",
      image:
        "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
    },
    {
      id: 2,
      title: "Food & Wine Expo",
      date: "September 10, 2023",
      location: "New York, NY",
      image:
        "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
    },
    {
      id: 3,
      title: "Tech Conference",
      date: "October 5, 2023",
      location: "Austin, TX",
      image:
        "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
    },
    {
      id: 4,
      title: "Art Exhibition",
      date: "November 20, 2023",
      location: "Chicago, IL",
      image:
        "https://images.unsplash.com/photo-1531058020387-3be344556be6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
    },
  ];

  // Steps for creating an event
  const createEventSteps = [
    {
      id: 1,
      title: "Create an Account",
      description: "Sign up for free and set up your profile.",
      icon: "users",
    },
    {
      id: 2,
      title: "Add Event Details",
      description: "Enter your event information, date, time, and location.",
      icon: "clipboard",
    },
    {
      id: 3,
      title: "Customize & Publish",
      description: "Upload images, set ticket prices, and publish your event.",
      icon: "rocket",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-700 to-purple-900 text-white">
        <div className="container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Create Unforgettable Events with Easy Fest
            </h1>
            <p className="text-xl md:text-2xl mb-10 text-purple-100">
              Your all-in-one platform for planning, managing, and promoting
              successful events that people will love.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button
                size="lg"
                className="bg-white text-purple-700 hover:bg-purple-100 text-lg"
                asChild
              >
                <Link to="/events">Explore Events</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white bg-purple-800 text-lg"
                asChild
              >
                <Link to="/create">Create Your Event</Link>
              </Button>
            </div>
          </div>
        </div>
        <div className="h-16 bg-white rounded-t-[50%] transform translate-y-1"></div>
      </section>

      {/* Featured Events Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              Discover Amazing Events
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Find the perfect events to attend or get inspired to create your
              own.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Button
              variant="outline"
              className="text-purple-700 border-purple-700 hover:bg-purple-50"
              asChild
            >
              <Link to="/events" className="inline-flex items-center">
                See All Events
                <ArrowRightIcon className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Create Event Guide Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              Create Your Event in Three Easy Steps
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform makes it simple to bring your event ideas to life.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {createEventSteps.map((step) => (
              <FeatureStep key={step.id} step={step} />
            ))}
          </div>

          <div className="text-center mt-16">
            <Button
              className="bg-purple-600 hover:bg-purple-700 text-white text-lg px-8 py-6 h-auto"
              asChild
            >
              <Link to="/create">Start Creating Your Event</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              What Event Organizers Say
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join thousands of event creators who trust Easy Fest.
            </p>
          </div>

          <div className="max-w-4xl mx-auto bg-purple-50 rounded-lg p-8 border border-purple-100">
            <p className="text-xl italic text-gray-700 mb-6">
              "Easy Fest transformed how we manage our annual music festival.
              The platform is intuitive, powerful, and our attendees love the
              experience!"
            </p>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-300 rounded-full mr-4"></div>
              <div>
                <h4 className="font-semibold text-gray-900">Sarah Johnson</h4>
                <p className="text-gray-600">Festival Director, SoundWave</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Create Your Next Amazing Event?
          </h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Join thousands of event organizers using Easy Fest to bring their
            ideas to life.
          </p>
          <Button
            size="lg"
            className="bg-white text-purple-700 hover:bg-purple-100 text-lg px-8 py-6 h-auto"
            asChild
          >
            <Link to="/signup">Get Started for Free</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;

// import React from "react";
// import { Button } from "@/components/ui/button";

// const LandingPage = () => {
//   const handleGetStarted = () => {
//     // Add registration/get started logic here
//   };

//   const handleViewEvents = () => {
//     // Add event listing logic here

//   };

//   const handleCreateEvent = () => {
//     // Add event creation logic here

//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <main className="max-w-7xl mx-auto px-4 py-8">
//         {/* Welcome Section */}
//         <section className="mb-8">
//           <h2 className="text-2xl font-bold mb-4">Welcome to Event Hub</h2>
//           <p className="mb-4">
//             Manage your events efficiently with our simple platform.
//           </p>
//           <Button onClick={handleGetStarted}>Get Started</Button>
//         </section>

//         {/* Quick Actions */}
//         <section className="mb-8">
//           <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
//           <div className="flex gap-4">
//             <Button variant="outline" onClick={handleViewEvents}>
//               View Events
//             </Button>
//             <Button onClick={handleCreateEvent}>Create Event</Button>
//           </div>
//         </section>

//         {/* Features List */}
//         <section>
//           <h3 className="text-xl font-bold mb-4">Features</h3>
//           <ul className="space-y-2">
//             <li>• Create and manage events</li>
//             <li>• Track registrations</li>
//             <li>• Send invitations</li>
//             <li>• Generate reports</li>
//           </ul>
//         </section>
//       </main>
//     </div>
//   );
// };

// export default LandingPage;
