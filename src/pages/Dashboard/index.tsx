import { useState, useEffect } from "react";

import Header from "../../components/Header";
import api from "../../services/api";
import Food from "../../components/Food";
import ModalAddFood from "../../components/ModalAddFood";
import ModalEditFood from "../../components/ModalEditFood";
import { FoodsContainer } from "./styles";

interface FoodItem {
  id: number;
  name: string;
  description: string;
  price: string;
  available: boolean;
  image: string;
}

function Dashboard() {
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [editingFood, setEditingFood] = useState<FoodItem>({} as FoodItem);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalOpenEdit, setModalOpenEdit] = useState(false);

  useEffect(() => {
    async function loadFoods() {
      const { data } = await api.get("/foods");
      setFoods(data);
    }
    loadFoods();
  }, []);

  async function handleAddFood(food: FoodItem) {
    try {
      const { data } = await api.post("/foods", {
        ...food,
        available: true,
      });

      setFoods([...foods, data]);
    } catch (err) {
      console.log(err);
    }
  }

  async function handleUpdateFood(food: FoodItem) {
    try {
      const { data } = await api.put(`/foods/${editingFood.id}`, {
        ...editingFood,
        ...food,
      });

      const foodsUpdated = foods.map((f) => (f.id !== data.id ? f : data));

      setFoods(foodsUpdated);
    } catch (err) {
      console.log(err);
    }
  }

  async function handleDeleteFood(id: number) {
    await api.delete(`/foods/${id}`);

    const foodsFiltered = foods.filter((food) => food.id !== id);

    setFoods(foodsFiltered);
  }

  async function handleEditFood(food: FoodItem) {
    setEditingFood(food);
    setModalOpenEdit(!modalOpenEdit);
  }

  return (
    <>
      <Header openModal={() => setModalOpen(!modalOpen)} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={() => setModalOpen(!modalOpen)}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={modalOpenEdit}
        setIsOpen={() => setModalOpenEdit(!modalOpenEdit)}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map((food) => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  );
}

export default Dashboard;