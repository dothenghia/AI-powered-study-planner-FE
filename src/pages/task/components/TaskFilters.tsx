import { Input } from "../../../components/ui/Input";
import { Select } from "../../../components/ui/Select";
import { Button } from "../../../components/ui/Button";
import { STATUS, PRIORITY } from "../../../types/common";

interface TaskFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  priorityFilter: string;
  onPriorityFilterChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  onSortPriority: () => void;
  onSortStatus: () => void;
  sortPriorityAsc: boolean | null;
  sortStatusAsc: boolean | null;
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
    { value: PRIORITY.HIGH, label: PRIORITY.HIGH },
    { value: PRIORITY.MEDIUM, label: PRIORITY.MEDIUM },
    { value: PRIORITY.LOW, label: PRIORITY.LOW },
  ];

  const statusOptions = [
    { value: "", label: "All Statuses" },
    { value: STATUS.TODO, label: STATUS.TODO },
    { value: STATUS.IN_PROGRESS, label: STATUS.IN_PROGRESS },
    { value: STATUS.COMPLETED, label: STATUS.COMPLETED },
    { value: STATUS.EXPIRED, label: STATUS.EXPIRED },
  ];

  const getPrioritySortLabel = () => {
    if (sortPriorityAsc === null) return "Sort Priority";
    return `Priority: ${sortPriorityAsc ? "↑" : "↓"}`;
  };

  const getStatusSortLabel = () => {
    if (sortStatusAsc === null) return "Sort Status";
    return `Status: ${sortStatusAsc ? "↑" : "↓"}`;
  };

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
        value={statusFilter}
        onChange={(e) => onStatusFilterChange(e.target.value)}
        options={statusOptions}
        className="w-36"
      />
      <Select
        value={priorityFilter}
        onChange={(e) => onPriorityFilterChange(e.target.value)}
        options={priorityOptions}
        className="w-36"
      />
      <Button
        variant={sortStatusAsc === null ? "secondary-outline" : "secondary"}
        onClick={onSortStatus}
        className="w-36"
      >
        {getStatusSortLabel()}
      </Button>
      <Button
        variant={sortPriorityAsc === null ? "secondary-outline" : "secondary"}
        onClick={onSortPriority}
        className="w-36"
      >
        {getPrioritySortLabel()}
      </Button>
    </div>
  );
}; 