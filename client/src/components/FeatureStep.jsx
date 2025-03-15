import { UsersIcon, ClipboardIcon, RocketIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const FeatureStep = ({ step }) => {
  // Render the appropriate icon based on the icon property
  const renderIcon = () => {
    switch (step.icon) {
      case "users":
        return <UsersIcon className="h-10 w-10 text-purple-600" />;
      case "clipboard":
        return <ClipboardIcon className="h-10 w-10 text-purple-600" />;
      case "rocket":
        return <RocketIcon className="h-10 w-10 text-purple-600" />;
      default:
        return <div className="h-10 w-10 bg-purple-200 rounded-full"></div>;
    }
  };

  return (
    <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="pt-6">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 p-3 bg-purple-100 rounded-full">
            {renderIcon()}
          </div>
          <div className="text-2xl font-bold mb-1 text-gray-900">
            {step.id}. {step.title}
          </div>
          <p className="text-gray-600">{step.description}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default FeatureStep;
