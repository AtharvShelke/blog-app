'use client';

import { Button } from '@/components/ui/button';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { useTransition } from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  categorySlug?: string;
}

export function Pagination({ currentPage, totalPages, categorySlug }: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const navigate = (page: number) => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      
      if (page === 1) {
        params.delete('page');
      } else {
        params.set('page', page.toString());
      }

      const queryString = params.toString();
      router.push(`/blog${queryString ? `?${queryString}` : ''}`);
      
      // Smooth scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  };

  const generatePageNumbers = () => {
    const pages: (number | string)[] = [];
    const showEllipsis = totalPages > 7;

    if (!showEllipsis) {
      // Show all pages if 7 or fewer
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage <= 3) {
        // Near the start
        pages.push(2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Near the end
        pages.push('...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        // Somewhere in the middle
        pages.push('...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }

    return pages;
  };

  const pageNumbers = generatePageNumbers();

  return (
    <div className="flex items-center gap-2">
      {/* First Page Button */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => navigate(1)}
        disabled={currentPage === 1 || isPending}
        className="hidden sm:flex"
      >
        <ChevronsLeft className="w-4 h-4" />
      </Button>

      {/* Previous Page Button */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => navigate(currentPage - 1)}
        disabled={currentPage === 1 || isPending}
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>

      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {pageNumbers.map((page, index) => {
          if (page === '...') {
            return (
              <span key={`ellipsis-${index}`} className="px-3 py-2 text-muted-foreground">
                ...
              </span>
            );
          }

          const pageNum = page as number;
          const isActive = pageNum === currentPage;

          return (
            <Button
              key={pageNum}
              variant={isActive ? 'default' : 'outline'}
              size="icon"
              onClick={() => navigate(pageNum)}
              disabled={isPending}
              className={`min-w-[40px] transition-all ${
                isActive ? 'scale-110' : 'hover:scale-105'
              }`}
            >
              {pageNum}
            </Button>
          );
        })}
      </div>

      {/* Next Page Button */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => navigate(currentPage + 1)}
        disabled={currentPage === totalPages || isPending}
      >
        <ChevronRight className="w-4 h-4" />
      </Button>

      {/* Last Page Button */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => navigate(totalPages)}
        disabled={currentPage === totalPages || isPending}
        className="hidden sm:flex"
      >
        <ChevronsRight className="w-4 h-4" />
      </Button>

      {/* Loading Indicator */}
      {isPending && (
        <div className="ml-2">
          <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}
