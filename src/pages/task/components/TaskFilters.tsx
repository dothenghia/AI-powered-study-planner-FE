import { Input } from "../../../components/ui/Input";
import { Select } from "../../../components/ui/Select";
import { Button } from "../../../components/ui/Button";

interface TaskFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  priorityFilter: string;
  onPriorityFilterChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  onSortPriority: () => void;
  onSortStatus: () => void;
  sortPriorityAsc: boolean;
  sortStatusAsc: boolean;
}

export const TaskFilters = ({
  searchTerm,
  onSearchChange,
  priorityFilter,
  onPriorityFilterChange,
  statusFilter,
  onStatusFilterChange,
  onSortPriority,
  onSortStatus,
  sortPriorityAsc,
  sortStatusAsc,
}: TaskFiltersProps) => {
  const priorityOptions = [
    { value: "", label: "All Priorities" },
    { value: "High", label: "High" },
    { value: "Medium", label: "Medium" },
    { value: "Low", label: "Low" },
  ];

  const statusOptions = [
    { value: "", label: "All Statuses" },
    { value: "Todo", label: "Todo" },
    { value: "In Progress", label: "In Progress" },
    { value: "Completed", label: "Completed" },
    { value: "Expired", label: "Expired" },
  ];

  return (
    <div className="flex gap-4 mb-6">
      <Input
        type="text"
        placeholder="Search tasks..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="flex-1"
      />
      <Select
        value={priorityFilter}
        onChange={(e) => onPriorityFilterChange(e.target.value)}
        options={priorityOptions}
        className="w-40"
      />
      <Select
        value={statusFilter}
        onChange={(e) => onStatusFilterChange(e.target.value)}
        options={statusOptions}
        className="w-40"
      />
      <Button variant="secondary" onClick={onSortPriority}>
        Sort by Priority {sortPriorityAsc ? "↑" : "↓"}
      </Button>
      <Button variant="secondary" onClick={onSortStatus}>
        Sort by Status {sortStatusAsc ? "↑" : "↓"}
      </Button>
    </div>
  );
}; 