import {
  reactExtension,
  Banner,
  BlockStack,
  Checkbox,
  Text,
  Image,
  useApi,
  useApplyAttributeChange,
  useInstructions,
  useTranslate,
  useCartLines,
  useTotalAmount
} from "@shopify/ui-extensions-react/checkout";

// 1. Choose an extension target
export default reactExtension("purchase.checkout.block.render", () => (
  <Extension />
));

function Extension() {
  const translate = useTranslate();
  const { extension } = useApi();
  const instructions = useInstructions();
  const applyAttributeChange = useApplyAttributeChange();

  const cartLines = useCartLines();
  const totalAmount = useTotalAmount();


  // 2. Check instructions for feature availability, see https://shopify.dev/docs/api/checkout-ui-extensions/apis/cart-instructions for details
  if (!instructions.attributes.canUpdateAttributes) {
    // For checkouts such as draft order invoices, cart attributes may not be allowed
    // Consider rendering a fallback UI or nothing at all, if the feature is unavailable
    return (
      <Banner title="checkout-calculator" status="warning">
        {translate("attributeChangesAreNotSupported")}
      </Banner>
    );
  }

  // 3. Render a UI
  return (
    <BlockStack border={"dotted"} padding={"tight"}>
      <Text>Calculadora de Cuotas: </Text>

      {/* TOTAL FINAL DEL CARRITO */}
      <BlockStack border="base" padding="base">
        <Text emphasis="bold">
          Total Final: ${totalAmount.amount} {totalAmount.currencyCode}
        </Text>
        <Text variant="bodyMd">Total en 3 coutas: ${(totalAmount.amount.toFixed(2)) * 1.3} </Text>
        <Text variant="bold">  Cuotas fijas de ${(totalAmount.amount / 3).toFixed(2)} {totalAmount.currencyCode}</Text>
        <Text variant="bodyMd">Total en 6 coutas: ${(totalAmount.amount.toFixed(2)) * 1.5} / 6 </Text>
        <Text variant="bold">  ${(totalAmount.amount / 6).toFixed(2)} {totalAmount.currencyCode}</Text>
        <Text variant="bodyMd">Total en 12 coutas: ${(totalAmount.amount.toFixed(2)) * 1.8} / 12 </Text>
        <Text variant="bold">  ${(totalAmount.amount / 6).toFixed(2)} {totalAmount.currencyCode}</Text>
      </BlockStack>
      <Checkbox onChange={onCheckboxChange}>
        {translate("iWouldLikeAFreeGiftWithMyOrder")}
      </Checkbox>


    </BlockStack>
  );

  async function onCheckboxChange(isChecked) {
    // 4. Call the API to modify checkout
    const result = await applyAttributeChange({
      key: "requestedFreeGift",
      type: "updateAttribute",
      value: isChecked ? "yes" : "no",
    });
    console.log("applyAttributeChange result", result);
  }
}