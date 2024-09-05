import { Button } from "@/components/ui/Button";
import "./pagination.css";

interface PaginationProps {
  currentPage: number;
  totalItems?: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
}: PaginationProps) => {
  if (!totalItems){
    return <></>;
  }

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <div className="pagination flex justify-center items-center space-x-2 mt-4 text-black">
      <Button
        className="pagination-btn"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous
      </Button>
      <span>{`Page ${currentPage} of ${totalPages}`}</span>
      <Button
        className="pagination-btn"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </Button>
    </div>
  );
};

export default Pagination;
