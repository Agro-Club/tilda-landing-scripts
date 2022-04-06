type Parameter = {
  id: string;
  name: string;
};

type ProductFromApi = {
  id: string;
  slug: string;
  title: string;
  order?: number;
  sale_bids_count: number;
  purchase_bids_count: number;
  main_parameter: Parameter;
  parameters: Parameter[];
};

type BidFromApi = {
  id: string;
  bid_type: "sale" | "purchase";
  status: "published" | "archived";
  price_exw: number;
  price_cpt: number;
  product: Pick<ProductFromApi, "id" | "slug" | "title">;
  parameters_description: string;
};

type Prices = {
  priceExw: number;
  priceCpt: number;
};

type Product = {
  title: string;
  purchase: Prices;
  sale: Prices;
  description?: string;
};

const api = async (input: RequestInfo, init?: RequestInit): Promise<any> => {
  const response = await fetch(input, init);
  const body = await response.json();

  if (response.ok) return body;

  throw new Error(input.toString() + " " + response.statusText);
};

const fetchBids = async (
  idProduct: string
): Promise<[BidFromApi, BidFromApi]> => {
  const responses = await Promise.all([
    api(
      `https://api.v2.agro.club/api/v1/market/bids/?bid_type=purchase&page_size=1&sort=-price_exw&product=${idProduct}&source_address=36818`
    ),
    api(
      `https://api.v2.agro.club/api/v1/market/bids/?bid_type=sale&page_size=1&sort=price_cpt&product=${idProduct}&source_address=36818`
    ),
  ]);

  return [responses[0].results[0], responses[1].results[0]];
};

const fetchProducts = async () => {
  const result: Product[] = [];
  const productsFromApi: ProductFromApi[] = await api(
    "https://api.v2.agro.club/api/v1/products?page_size=6"
  );
  const prices = await Promise.all(
    productsFromApi.slice(0, 6).map((product) => fetchBids(product.slug))
  );

  prices
    .filter((price) => price[0] && price[1])
    .forEach((price, index) => {
      const purchase = price[0];
      const sale = price[1];

      result.push({
        title: productsFromApi[index].title,
        purchase: {
          priceExw: purchase.price_exw,
          priceCpt: purchase.price_cpt,
        },
        sale: {
          priceExw: sale.price_exw,
          priceCpt: sale.price_cpt,
        },
      });
    });
  return result;
};

const productPromise = fetchProducts();

const createCard = (product: Product, bid_type: BidFromApi["bid_type"]) => `
  <div class="grains__card">
    <h4 class="grains__card__title typography_h5">${product.title}</h4>
    <div class="grains__card__description typography_caption-default">
      300 т / ≥10
    </div>
    <div class="grains__card__prices">
      <div
        class="grains__card__price typography_caption-default"
        data-type="cpt"
      >
        ${product[bid_type].priceCpt} ₽/кг
        <span class="grains__card__price__caption typography_caption-default">
          CPT
        </span>
      </div>
      <div class="grains__card__price typography_h5-bold" data-type="exw">
        ${product[bid_type].priceExw} ₽/кг
        <span class="grains__card__price__caption typography_caption-default">
          EXW
        </span>
      </div>
    </div>
  </div>
`;

$(document).ready(() => {
  productPromise.then((products) => {
    $("#grains__content").html(
      products.reduce(
        (acc, product) => acc + createCard(product, "purchase"),
        ""
      )
    );
    $("#grains__loader").hide();
  });
});
