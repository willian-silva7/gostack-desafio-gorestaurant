import React, { useState, useEffect } from 'react';

import Header from '../../components/Header';

import api from '../../services/api';

import Food from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';

import { FoodsContainer } from './styles';

interface IFoodPlate {
  id: number;
  name: string;
  image: string;
  price: string;
  description: string;
  available: boolean;
}

const Dashboard: React.FC = () => {
  const [foods, setFoods] = useState<IFoodPlate[]>([]);
  const [editingFood, setEditingFood] = useState<IFoodPlate>({} as IFoodPlate);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    async function loadFoods(): Promise<void> {
      api.get('/foods').then(response => {
        setFoods(response.data);
      });
    }

    loadFoods();
  }, []);

  async function handleAddFood(
    food: Omit<IFoodPlate, 'id' | 'available'>,
  ): Promise<void> {
    try {
      // TODO ADD A NEW FOOD PLATE TO THE API
      const foodTemplate = {
        name: food.name,
        description: food.description,
        image: food.image,
        price: food.price,
        available: true,
      };
      const response = await api.post('/foods', foodTemplate);

      const newFood = response.data;

      setFoods([...foods, newFood]);
    } catch (err) {
      console.log(err);
    }
  }

  async function handleUpdateFood(
    food: Omit<IFoodPlate, 'id' | 'available'>,
  ): Promise<void> {
    const foodBeUpdated = foods.find(
      uniqueFood => uniqueFood.name === food.name,
    );

    if (foodBeUpdated) {
      const response = await api.put(`/foods/${foodBeUpdated.id}`, {
        ...food,
        available: foodBeUpdated.available,
      });
      const updateFood = response.data;

      const foodIndex = foods.findIndex(
        uniqueFood => uniqueFood.id === updateFood.id,
      );

      foods.splice(foodIndex, 1, updateFood);

      setFoods([...foods]);
    }

    // TODO UPDATE A FOOD PLATE ON THE API
  }

  async function handleDeleteFood(id: number): Promise<void> {
    // TODO DELETE A FOOD PLATE FROM THE API
    const foodBeUpdated = foods.findIndex(food => food.id === id);

    foods.splice(foodBeUpdated, 1);

    setFoods([...foods]);
    await api.delete(`/foods/${id}`);
  }

  function toggleModal(): void {
    setModalOpen(!modalOpen);
  }

  function toggleEditModal(): void {
    setEditModalOpen(!editModalOpen);
  }

  function handleEditFood(food: IFoodPlate): void {
    setEditingFood(food);
    toggleEditModal();
    // TODO SET THE CURRENT EDITING FOOD ID IN THE STATE
  }

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map(food => (
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
};

export default Dashboard;
