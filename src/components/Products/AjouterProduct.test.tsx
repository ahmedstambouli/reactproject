// AjouterProduct.test.tsx

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AjouterProduct from './AjouterProduct'; // Assurez-vous que le chemin est correct
import axios from 'axios';

// Mocking de l'API Axios
jest.mock('axios');

describe('AjouterProduct Component', () => {
  // Test de la validation des champs vides
  test('Affiche les erreurs de validation lorsque les champs sont vides', async () => {
    render(<AjouterProduct />);

    // Soumettre le formulaire sans remplir les champs
    const submitButton = screen.getByText(/submit/i); // Assurez-vous que le texte est correct
    fireEvent.click(submitButton);

    // Vérification des messages d'erreur
    const productNameError = await screen.findByText(/Le nom du produit est requis/i);
    expect(productNameError).toBeInTheDocument();

    const priceError = await screen.findByText(/Entrez un prix valide/i);
    expect(priceError).toBeInTheDocument();
  });

  // Test de la récupération des catégories via l'API
  test('Récupère et affiche les catégories à partir de l\'API', async () => {
    const mockCategories = [
      { id: '1', name: 'Electronique' },
      { id: '2', name: 'Vêtements' }
    ];

    // Simulation de la réponse de l'API
    axios.get.mockResolvedValueOnce({ data: { $values: mockCategories } });

    render(<AjouterProduct />);

    // Attendre que les catégories soient affichées
    await waitFor(() => {
      expect(screen.getByText(/Electronique/)).toBeInTheDocument();
      expect(screen.getByText(/Vêtements/)).toBeInTheDocument();
    });
  });

  // Test de la mise à jour de l'état du produit avec des entrées valides
  test('Met à jour le nom du produit et le prix', () => {
    render(<AjouterProduct />);

    const productNameInput = screen.getByPlaceholderText(/Entrez le nom du produit/i);
    fireEvent.change(productNameInput, { target: { value: 'Produit Test' } });

    const priceInput = screen.getByPlaceholderText(/Entrez le prix du produit/i);
    fireEvent.change(priceInput, { target: { value: '20' } });

    // Vérification que les valeurs sont bien mises à jour
    expect(productNameInput.value).toBe('Produit Test');
    expect(priceInput.value).toBe('20');
  });

  // Test de l'affichage des erreurs lors de la soumission avec des données invalides
  test('Affiche un message d\'erreur lors de la soumission avec des données invalides', async () => {
    render(<AjouterProduct />);

    const submitButton = screen.getByText(/submit/i);
    fireEvent.click(submitButton);

    // Vérification que les messages d'erreur sont affichés
    await waitFor(() => {
      expect(screen.getByText(/Le nom du produit est requis/i)).toBeInTheDocument();
      expect(screen.getByText(/Entrez un prix valide/i)).toBeInTheDocument();
    });
  });

  // Test de l'intégration avec les snapshots (facultatif)
  test('Snapshot du composant AjouterProduct', () => {
    const { asFragment } = render(<AjouterProduct />);
    expect(asFragment()).toMatchSnapshot();
  });
});
