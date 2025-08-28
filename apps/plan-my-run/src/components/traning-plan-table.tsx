"use client";

import { useTRPC } from "@/vendors/trpc/client";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
  cn,
} from "@heroui/react";
import { useQuery } from "@tanstack/react-query";

export interface DayPlan {
  title: string;
  description?: string;
}

const columns = [
  { key: "week", label: "Week & Total Weekly Distance" },
  { key: "monday", label: "Monday" },
  { key: "tuesday", label: "Tuesday" },
  { key: "wednesday", label: "Wednesday" },
  { key: "thursday", label: "Thursday" },
  { key: "friday", label: "Friday" },
  { key: "saturday", label: "Saturday" },
  { key: "sunday", label: "Sunday" },
];

const renderDay = (day: DayPlan) => {
  return (
    <div>
      <p className="font-medium">{day?.title}</p>
      {day?.description && (
        <p className="text-xs text-gray-500">{day?.description}</p>
      )}
    </div>
  );
};

export const TrainingPlanTable = () => {
  const trpc = useTRPC();

  const { data: plan } = useQuery(
    trpc.v1.userRunningPlan.get.queryOptions({
      distance: 10,
      unit: "kilometers",
      hillyType: "flat",
      runningLevel: "intermediate",
      weeklyRunningPlan: {
        longRunDay: "sunday",
        availableDays: ["monday", "wednesday", "friday", "sunday"],
      },
      totalTrainingWeeks: 7,
      goalTime: { hour: 0, minute: 60, second: 0 },
    })
  );

  const rows = (plan || []).map((week) => ({
    key: String(week.week),
    week: (
      <div>
        <p>Week {week.week}</p>
        <p className="text-xs text-gray-500">{week.total}</p>
      </div>
    ),
    monday: renderDay(week.days[0]),
    tuesday: renderDay(week.days[1]),
    wednesday: renderDay(week.days[2]),
    thursday: renderDay(week.days[3]),
    friday: renderDay(week.days[4]),
    saturday: renderDay(week.days[5]),
    sunday: renderDay(week.days[6]),
  }));

  return (
    <Table aria-label="Training plan">
      <TableHeader columns={columns}>
        {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
      </TableHeader>
      <TableBody items={rows}>
        {(item) => (
          <TableRow key={item.key}>
            {(columnKey) => (
              <TableCell>{getKeyValue(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
