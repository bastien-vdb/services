import Services from "@/app/admin/Components/Services/Services";
import { ServiceProvider } from "@/src/contexts/service.context";
import { render, screen, fireEvent } from "@testing-library/react";

describe("Test of Admin/Services component functions", () => {
  it("Click on Button delete and expect a deletion in table", async () => {

    render(
      <ServiceProvider>
        <Services />
      </ServiceProvider>
    );

    const deleteButtons = await screen.getAllByRole('button', { name: 'Supprimer' })

    await fireEvent.click(deleteButtons[0]);

    const deleteButtonsAfterClick = await screen.getAllByRole('button', { name: 'Supprimer' })

    expect(deleteButtonsAfterClick.length).toBe(deleteButtons.length - 1)

  });

  it("Click on Button delete and expect a deletion in table", async () => {

    render(
      <ServiceProvider>
        <Services />
      </ServiceProvider>
    );


    const buttons = screen.getAllByRole('button');
    const servicenameInput = await screen.getByPlaceholderText('Service name');

    fireEvent.change(servicenameInput, { target: { value: 'testService' } });
    fireEvent.click(buttons[buttons.length - 1]);

    const prestationSelected = screen.getAllByTestId('table-cell');
    expect(prestationSelected[prestationSelected.length - 1 - 2].textContent).toBe('testService');


  });
});
