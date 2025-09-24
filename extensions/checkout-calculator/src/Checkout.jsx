import {
  reactExtension,
  Banner,
  BlockStack,
  Checkbox,
  Text,
  ChoiceList,
  Choice,
  Icon,
  useApi,
  useApplyAttributeChange,
  useInstructions,
  useTranslate,
  useCartLines,
  useTotalAmount
} from "@shopify/ui-extensions-react/checkout";
import { Heading } from "@shopify/ui-extensions/checkout";
import { useState } from "react";

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

  const [selectedCuota, setSelectedCuota] = useState("3");


  const cuotaOptions = [
    { label: `Total en 3 cuotas: ${(totalAmount.amount * 1.2).toFixed(2)}`, value: "3" },
    { label: `Total en 6 cuotas: ${(totalAmount.amount * 1.5).toFixed(2)}`, value: "6" },
    { label: `Total en 12 cuotas: ${(totalAmount.amount * 1.8).toFixed(2)}`, value: "12" },
  ];


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
      <Heading>Calculadora de Cuotas</Heading>

      {/* TOTAL FINAL DEL CARRITO */}
      <BlockStack border="base" padding="base">

        <Text variant="headingMd" as="h2">
          Total del carrito: ${totalAmount.amount.toFixed(2)}
        </Text>
        <Text variant="bodyMd" as="p">
          Selecciona en cuantas cuotas queres pagar tu compra.
        </Text>
        <ChoiceList
          name="group-single"
          variant="group"
          value="ship"
          onChange={onCuotasChange}
        >
          <Choice
            secondaryContent={
              <Icon source="bag" />
            }
            id="3"
          >
            3 coutas: ${(totalAmount.amount * 1.2).toFixed(2)}
          </Choice>
          <Choice
            secondaryContent={
              <Icon source="bag" />
            }
            id="6"
          >
            6 coutas: ${(totalAmount.amount * 1.4).toFixed(2)}
          </Choice>
          <Choice
            secondaryContent={
              <Icon source="bag" />
            }
            id="12"
          >
            12 coutas: ${(totalAmount.amount * 1.6).toFixed(2)}

          </Choice>
        </ChoiceList>
      </BlockStack>
      {/* <Checkbox onChange={onCheckboxChange}>
        {translate("iWouldLikeAFreeGiftWithMyOrder")}
      </Checkbox> */}


    </BlockStack>
  );


  async function onCuotasChange(value) {
    setSelectedCuota(value);
    applyAttributeChange({
      key: "cuotas",
      type: "updateAttribute",
      value,
    });
    console.log("applyAttributeChange result de cuotas", result);

  };

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