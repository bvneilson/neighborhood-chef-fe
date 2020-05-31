import React from "react";

import AddAllergy from "./AddAllergy.js";
import AddDietWarning from "./AddDietWarning.js";
import AddIngredient from "./AddIngredient.js";

const AdvancedOptions = ({
  allergenList,
  setAllergenList,
  dietWarnings,
  setDietWarnings,
  ingredientList,
  setIngredientList,
}) => {
  return (
    <>
      <AddAllergy
        allergenList={allergenList}
        setAllergenList={setAllergenList}
      />
      <AddDietWarning
        dietWarnings={dietWarnings}
        setDietWarnings={setDietWarnings}
      />
      <AddIngredient
        ingredientList={ingredientList}
        setIngredientList={setIngredientList}
      />
    </>
  );
};

export default AdvancedOptions;
