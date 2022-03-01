import { useState , useEffect } from 'react'
import {FoodInterface} from '../../types/Food' 
import Header from '../../components/Header';
import api from '../../services/api';
import Food from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';
import { FoodsContainer } from './styles';

export default function  Dashboard () {

  const [modalOpen , SetModalOpen ] = useState(false)
  const [editModalOpen , SetEditModalOpen ] = useState(false) 
  const [foods , setFoods] = useState<FoodInterface[]>([])
  const [editingFood , setEditingFood] = useState<FoodInterface>({} as FoodInterface)

  useEffect( () => {
    async  function LoadFood() {
      const response = await api.get('/foods');
      setFoods(response.data)
    } 

     LoadFood()
  }
  ,[])

  async function handleAddFood(food:FoodInterface){
    try {
      const response = await api.post('/foods', {
        ...food,
        available: true,
      });

      setFoods([...foods, response.data])
    } catch (err) {
      console.log(err);
    }
  }
 



  async function handleUpdateFood(food: FoodInterface) {

    try {
      const foodUpdated = await api.put(
        `/foods/${editingFood.id}`,
        { ...editingFood, ...food },
      );

      const foodsUpdated = foods.map(f =>
        f.id !== foodUpdated.data.id ? f : foodUpdated.data,
      );

      setFoods(foodsUpdated);
    } catch (err) {
      console.log(err);
    }
  }

  async function handleDeleteFood(id:number){
    await api.delete(`/foods/${id}`);
    const foodsFiltered = foods.filter(food => food.id !== id);
    setFoods(foodsFiltered);
  }

const toggleModal = () => {   
  SetModalOpen(!modalOpen )
}

const toggleEditModal = () => {
  SetEditModalOpen(!editModalOpen );
}

const handleEditFood = (food: FoodInterface) => {
  setEditingFood(food)
  SetEditModalOpen(true)
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
  }

