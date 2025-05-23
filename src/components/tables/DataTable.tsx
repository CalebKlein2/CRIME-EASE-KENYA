// src/components/tables/DataTable.tsx
// @ts-nocheck
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  SlidersHorizontal 
} from "lucide-react";

interface DataTableProps<T> {
  data: T[];
  columns: ({
    key: string;
    header: string | (() => React.ReactNode);
    cell: (item: T) => React.ReactNode;
    sortable?: boolean;
  } | {
    accessorKey: string; // For backward compatibility
    header: string | (() => React.ReactNode);
    cell?: (row: { original: T }) => React.ReactNode; // For backward compatibility
    id?: string; // For backward compatibility
    sortable?: boolean;
  })[];
  searchable?: boolean;
  pagination?: boolean;
  pageSize?: number;
  actions?: (item: T) => React.ReactNode;
  onRowClick?: ((item: T) => void) | ((id: string) => void); // Support both item and id parameters
}

export function DataTable<T extends { id: string }>({
  data,
  columns,
  searchable = true,
  pagination = true,
  pageSize = 10,
  actions,
  onRowClick,
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [sortConfig, setSortConfig] = React.useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);

  // Search functionality
  const filteredData = React.useMemo(() => {
    if (!searchTerm) return data;
    return data.filter((item) =>
      Object.values(item).some(
        (value) =>
          value &&
          value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [data, searchTerm]);

  // Sorting
  const sortedData = React.useMemo(() => {
    if (!sortConfig) return filteredData;
    return [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key as keyof T];
      const bValue = b[sortConfig.key as keyof T];
      
      if (aValue < bValue) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  }, [filteredData, sortConfig]);

  // Pagination
  const paginatedData = React.useMemo(() => {
    if (!pagination) return sortedData;
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize, pagination]);

  const totalPages = Math.ceil(sortedData.length / pageSize);

  const handleSort = (key: string) => {
    setSortConfig((prevConfig) => {
      if (prevConfig && prevConfig.key === key) {
        const direction = prevConfig.direction === "asc" ? "desc" : "asc";
        return { key, direction };
      }
      return { key, direction: "asc" };
    });
  };

  // Helper function to get column key
  const getColumnKey = (column: any): string => {
    return column.key || column.accessorKey || column.id || '';
  };

  // Helper function to render cell content
  const renderCell = (column: any, item: T): React.ReactNode => {
    if (column.cell) {
      return typeof column.cell === 'function' ? column.cell(item) : column.cell;
    } else if (column.accessorKey) {
      // For backward compatibility with accessorKey
      return column.cell ? column.cell({ original: item }) : (item as any)[column.accessorKey];
    }
    return null;
  };

  // Helper function to render header content
  const renderHeader = (header: string | (() => React.ReactNode)): React.ReactNode => {
    return typeof header === 'function' ? header() : header;
  };

  return (
    <div className="space-y-4">
      {searchable && (
        <div className="flex items-center gap-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" size="icon">
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
        </div>
      )}

      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={getColumnKey(column)}>
                  <div
                    className={`flex items-center ${
                      column.sortable ? "cursor-pointer" : ""
                    }`}
                    onClick={() => column.sortable && handleSort(getColumnKey(column))}
                  >
                    {renderHeader(column.header)}
                    {sortConfig?.key === getColumnKey(column) && (
                      <span className="ml-1">
                        {sortConfig.direction === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </TableHead>
              ))}
              {actions && <TableHead>Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((item) => (
              <TableRow
                key={item.id}
                className={onRowClick ? "cursor-pointer hover:bg-gray-50" : ""}
                onClick={() => {
                  if (onRowClick) {
                    // Check if the function expects an id or the full item
                    const handler = onRowClick as any;
                    if (handler.length === 1) {
                      // If it expects one parameter, try to determine if it's an id or item
                      if (typeof item === 'string') {
                        handler(item);
                      } else {
                        handler(item);
                      }
                    }
                  }
                }}
              >
                {columns.map((column) => (
                  <TableCell key={`${item.id}-${getColumnKey(column)}`}>
                    {renderCell(column, item)}
                  </TableCell>
                ))}
                {actions && <TableCell>{actions(item)}</TableCell>}
              </TableRow>
            ))}
            {paginatedData.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (actions ? 1 : 0)}
                  className="text-center py-4 text-gray-500"
                >
                  No data found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {pagination && totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing {(currentPage - 1) * pageSize + 1} to{" "}
            {Math.min(currentPage * pageSize, sortedData.length)} of{" "}
            {sortedData.length} results
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}