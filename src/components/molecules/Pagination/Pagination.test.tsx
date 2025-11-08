import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Pagination } from "./Pagination";

describe("Pagination", () => {
  it("should not render when totalPages is 1 or less", () => {
    const { container } = render(
      <Pagination currentPage={1} totalPages={1} onPageChange={() => {}} />
    );
    expect(container.firstChild).toBeNull();
  });

  it("should render pagination controls", () => {
    render(
      <Pagination currentPage={1} totalPages={5} onPageChange={() => {}} />
    );

    expect(screen.getByText("Página 1 de 5")).toBeInTheDocument();
    expect(screen.getByText("Anterior")).toBeInTheDocument();
    expect(screen.getByText("Próxima")).toBeInTheDocument();
  });

  it("should display item range when totalItems is provided", () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        onPageChange={() => {}}
        itemsPerPage={20}
        totalItems={100}
      />
    );

    expect(screen.getByText("1-20 de 100")).toBeInTheDocument();
  });

  it("should disable previous button on first page", () => {
    render(
      <Pagination currentPage={1} totalPages={5} onPageChange={() => {}} />
    );

    const previousButton = screen.getByText("Anterior").closest("button");
    expect(previousButton).toBeDisabled();
  });

  it("should disable next button on last page", () => {
    render(
      <Pagination currentPage={5} totalPages={5} onPageChange={() => {}} />
    );

    const nextButton = screen.getByText("Próxima").closest("button");
    expect(nextButton).toBeDisabled();
  });

  it("should call onPageChange when clicking next", () => {
    const handlePageChange = vi.fn();
    render(
      <Pagination
        currentPage={2}
        totalPages={5}
        onPageChange={handlePageChange}
      />
    );

    fireEvent.click(screen.getByText("Próxima"));
    expect(handlePageChange).toHaveBeenCalledWith(3);
  });

  it("should call onPageChange when clicking previous", () => {
    const handlePageChange = vi.fn();
    render(
      <Pagination
        currentPage={3}
        totalPages={5}
        onPageChange={handlePageChange}
      />
    );

    fireEvent.click(screen.getByText("Anterior"));
    expect(handlePageChange).toHaveBeenCalledWith(2);
  });

  it("should not call onPageChange when button is disabled", () => {
    const handlePageChange = vi.fn();
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        onPageChange={handlePageChange}
      />
    );

    const previousButton = screen.getByText("Anterior").closest("button");
    fireEvent.click(previousButton!);
    expect(handlePageChange).not.toHaveBeenCalled();
  });

  it("should calculate correct end item on last page", () => {
    render(
      <Pagination
        currentPage={3}
        totalPages={3}
        onPageChange={() => {}}
        itemsPerPage={20}
        totalItems={55}
      />
    );

    expect(screen.getByText("41-55 de 55")).toBeInTheDocument();
  });
});
