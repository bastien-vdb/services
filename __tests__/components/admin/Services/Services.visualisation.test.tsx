import Services from "@/src/components/Admin/Services/Services";
import { ServiceProvider } from "@/src/contexts/service.context";
import { render, screen } from "@testing-library/react";

describe("Test of Admin/Services component displayed on screen", () => {
  it("badge", () => {

    render(
      <ServiceProvider>
        <Services />
      </ServiceProvider>
    );

    const badge = screen.findAllByText('Service');
    expect(badge).toBeDefined();
  });

  it("inputs", () => {

    render(
      <ServiceProvider>
        <Services />
      </ServiceProvider>
    );

    const servicenameInput = screen.getByPlaceholderText('Service name')
    expect(servicenameInput).toBeDefined();

    const priceInput = screen.getByPlaceholderText('€')
    expect(priceInput).toBeDefined();
  });

  it("buttons", () => {

    render(
      <ServiceProvider>
        <Services />
      </ServiceProvider>
    );

    const allButtons = screen.getAllByRole('button');
    const deleteButton1 = allButtons[0];
    expect(deleteButton1?.textContent).toBe('Supprimer');

    const AddButton = allButtons.pop(); //Last button
    expect(AddButton?.textContent).toBe('Add');
  });
});
