import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Money } from "@/components/money";
import { formatMoney } from "@/lib/money";

describe("Money", () => {
  it("muestra el precio formateado de una referencia", () => {
    render(<Money value={2500} />);
    const node = screen.getByText((content) => content.replace(/\s/g, "").includes("2500"));
    expect(node.textContent?.replace(/\s/g, "")).toBe(formatMoney(2500).replace(/\s/g, ""));
  });
});
