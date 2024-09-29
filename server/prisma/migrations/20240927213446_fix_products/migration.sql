-- AlterTable
CREATE SEQUENCE products_productid_seq;
ALTER TABLE "Products" ALTER COLUMN "productId" SET DEFAULT nextval('products_productid_seq');
ALTER SEQUENCE products_productid_seq OWNED BY "Products"."productId";
