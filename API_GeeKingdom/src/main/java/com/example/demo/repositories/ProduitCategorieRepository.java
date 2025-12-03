package com.example.demo.repositories;

import com.example.demo.models.ProduitCategorie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProduitCategorieRepository extends JpaRepository<ProduitCategorie, Integer> {

    /**
     * Find all categories for a specific product
     * @param idProduit The product ID
     * @return List of ProduitCategorie associations
     */
    List<ProduitCategorie> findByProduitIdProduit(Integer idProduit);

    /**
     * Find all products in a specific category
     * @param idCategorie The category ID
     * @return List of ProduitCategorie associations
     */
    List<ProduitCategorie> findByCategorieIdCategorie(Integer idCategorie);

    /**
     * Find the primary category for a product
     * @param idProduit The product ID
     * @return Optional ProduitCategorie that is marked as primary
     */
    Optional<ProduitCategorie> findByProduitIdProduitAndEstCategoriePrincipaleTrue(Integer idProduit);

    /**
     * Check if a product-category association exists
     * @param idProduit The product ID
     * @param idCategorie The category ID
     * @return true if association exists
     */
    boolean existsByProduitIdProduitAndCategorieIdCategorie(Integer idProduit, Integer idCategorie);

    /**
     * Find specific product-category association
     * @param idProduit The product ID
     * @param idCategorie The category ID
     * @return Optional ProduitCategorie
     */
    Optional<ProduitCategorie> findByProduitIdProduitAndCategorieIdCategorie(Integer idProduit, Integer idCategorie);

    /**
     * Count distinct products in a category
     * @param idCategorie The category ID
     * @return Count of products
     */
    @Query("SELECT COUNT(DISTINCT pc.produit) FROM ProduitCategorie pc WHERE pc.categorie.idCategorie = :idCategorie")
    Long countProductsByCategory(@Param("idCategorie") Integer idCategorie);

    /**
     * Count categories for a product
     * @param idProduit The product ID
     * @return Count of categories
     */
    @Query("SELECT COUNT(pc) FROM ProduitCategorie pc WHERE pc.produit.idProduit = :idProduit")
    Long countCategoriesByProduct(@Param("idProduit") Integer idProduit);

    /**
     * Get all products that belong to multiple categories
     * @return List of ProduitCategorie for products with multiple categories
     */
    @Query("SELECT pc FROM ProduitCategorie pc WHERE pc.produit.idProduit IN " +
            "(SELECT pc2.produit.idProduit FROM ProduitCategorie pc2 GROUP BY pc2.produit.idProduit HAVING COUNT(pc2) > 1)")
    List<ProduitCategorie> findProductsWithMultipleCategories();

    /**
     * Delete all category associations for a product
     * @param idProduit The product ID
     */
    void deleteByProduitIdProduit(Integer idProduit);

    /**
     * Delete all product associations for a category
     * @param idCategorie The category ID
     */
    void deleteByCategorieIdCategorie(Integer idCategorie);
}