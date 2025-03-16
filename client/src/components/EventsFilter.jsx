import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { categories, months, statuses } from "../data/eventsData.js";

const EventsFilter = ({
  selectedStatus,
  setSelectedStatus,
  selectedMonth,
  setSelectedMonth,
  selectedCategory,
  setSelectedCategory,
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="w-full md:w-1/3">
        <label
          htmlFor="status-filter"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Status
        </label>
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger id="status-filter" className="w-full">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {statuses.map((status) => (
              <SelectItem key={status} value={status} className="capitalize">
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="w-full md:w-1/3">
        <label
          htmlFor="month-filter"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Month
        </label>
        <Select value={selectedMonth} onValueChange={setSelectedMonth}>
          <SelectTrigger id="month-filter" className="w-full">
            <SelectValue placeholder="Filter by month" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Months</SelectItem>
            {months.map((month) => (
              <SelectItem key={month} value={month}>
                {month}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="w-full md:w-1/3">
        <label
          htmlFor="category-filter"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Category
        </label>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger id="category-filter" className="w-full">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default EventsFilter;
