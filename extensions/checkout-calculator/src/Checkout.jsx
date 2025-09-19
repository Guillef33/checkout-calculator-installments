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
        <Checkbox variant="bodyMd" onChange={onCuotasChange}>Total en 3 coutas: ${(totalAmount.amount * 1.2).toFixed(2)} </Checkbox>
        {/* <Text variant="bold">  Cuotas fijas de ${(totalAmount.amount * 1.2 / 3).toFixed(2)} {totalAmount.currencyCode}</Text> */}
        <Checkbox onChange={onCuotasChange}
          variant="bodyMd">Total en 6 coutas: ${(totalAmount.amount * 1.5).toFixed(2)} / 6 </Checkbox>
        {/* <Text variant="bold" >  ${(totalAmount.amount * 1.5 / 6).toFixed(2)} {totalAmount.currencyCode}</Text> */}
        <Checkbox onChange={onCuotasChange} variant="bodyMd">Total en 12 coutas: ${(totalAmount.amount * 1.8).toFixed(2)}</Checkbox>
        {/* <Text variant="bold" >  ${(totalAmount.amount * 1.8 / 12).toFixed(2)} {totalAmount.currencyCode}</Text> */}
      </BlockStack>
      {/* <Checkbox onChange={onCheckboxChange}>
        {translate("iWouldLikeAFreeGiftWithMyOrder")}
      </Checkbox> */}


    </BlockStack>
  );

  async function onCuotasChange(isChecked) {
    // Guardamos en atributos de checkout si el cliente eligió cuotas o no
    const result = await applyAttributeChange({
      key: "cuotas",
      type: "updateAttribute",
      value: isChecked ? "true" : "false",
    });

    console.log("applyAttributeChange cuotas result", result);
  }

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