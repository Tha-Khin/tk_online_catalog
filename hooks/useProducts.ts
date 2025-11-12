import { db } from "@/firebase/firebase";
import { Product } from "@/types";
import { collection, getDocs, doc, getDoc, query, where, limit, updateDoc } from "firebase/firestore";
import { useQuery, useQueryClient } from '@tanstack/react-query';

const fetchProducts = async (): Promise<Product[]> => {
  const querySnapshot = await getDocs(collection(db, "products"));
  
  const products: Product[] = [];
  querySnapshot.forEach((doc) => {
    products.push({ id: doc.id, ...doc.data() } as Product); 
  });
  
  return products;
};

export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
    staleTime: 1000 * 60 * 5, 
  });
};

const fetchProductById = async (productId: string): Promise<Product> => {
  const docRef = doc(db, "products", productId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    throw new Error(`Product with ID ${productId} not found.`);
  }

  return { id: docSnap.id, ...docSnap.data() } as Product;
};

export const useProductDetail = (productId: string) => {
  const queryClient = useQueryClient();

  return useQuery({
    // IMPORTANT: The query key MUST be specific: ['products', productId]
    queryKey: ['products', productId], 
    queryFn: () => fetchProductById(productId),
    
    // INITIAL DATA: Look in the cache for the list query
    initialData: () => {
      const products = queryClient.getQueryData<Product[]>(['products']);
      const product = products?.find(p => p.id === productId);
      return product;
    },
    staleTime: 1000 * 10, // Keep data fresh for 10 seconds, then re-fetch
  });
};

export const fetchRelatedProducts = async (category: string, currentProductId: string): Promise<Product[]> => {
  const productsRef = collection(db, "products");
  const q = query(productsRef, where("category", "==", category), limit(6));

  const querySnapshot = await getDocs(q);

  const relatedProducts: Product[] = [];
  querySnapshot.forEach((doc) => {
    relatedProducts.push({ id: doc.id, ...doc.data() } as Product);
  });
  // 2. Filter out the current product
  return relatedProducts.filter(product => product.id !== currentProductId);
};

export const useRelatedProducts = (category?: string, currentProductId?: string) => {
  return useQuery({
    queryKey: ['products', 'related', category, currentProductId],
    queryFn: () => fetchRelatedProducts(category!, currentProductId!),
    // Only run this query if 'category' and 'currentProductId' are provided
    enabled: !!category && !!currentProductId,
  });
};

export const toggleIsActive = async (productId: string) => {
  const productRef = doc(db, "products", productId);
  const snapshot = await getDoc(productRef);
  if (!snapshot.exists()) {
  throw new Error("Product not found");
  }
  const currentStatus = snapshot.data().isActive ?? false;
  await updateDoc(productRef, {
      isActive: !currentStatus,
  });
  return !currentStatus;
};