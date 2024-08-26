import ProductDetails from "../../../components/Products/ProductDetails";

const ProductPage = ({ params }) => {
  const { id } = params;
  return <ProductDetails productId={id} />;
};

export default ProductPage;
