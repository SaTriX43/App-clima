// Importamos 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './App.css';
import { faBattery, faSun, faWifi } from '@fortawesome/free-solid-svg-icons';
import GifArbol from './imagenes/arbol-cayendo-hojas.gif'
import { useEffect, useState } from 'react';

function App() {
  // creamos variable para guardar valores
  const [climateData , setClimateData] = useState(
    { city: null , temperature: null , description: null , icon: null }
  );

  //detecta lo que escribimos en input
  const [valueInput , setValueInput] = useState('');
  // Guaradamos el valor de input 
  const [city , setCity] = useState('');

  // actualiza el valor del input 
  function updateValueInput(e) {
    setValueInput(e.target.value);
  }

  // guarda el nuevo valor dependiendo si hago click 
  function clickButton() {
    setCity(valueInput);
  }


  // Funcion para Peticion 
  async function peticion(ciudad) {
    const apiKey = '2019eed105761bd8795073ba660104af';//llave
    try {
      // mandamos peticion 
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${ciudad}&appid=${apiKey}&units=metric`);
      const json = await response.json(); //respuesta en json
      
      if(response.ok) {
        // actualizamos los valores de climateData con json 
        setClimateData({
          city: json.name,
          temperature: json.main.temp,
          description: json.weather[0].description,
          icon: json.weather[0].icon // Asegúrate de usar este ícono si tienes los iconos mapeados en tu proyecto
        });
      } else {
        setClimateData({
          city: null,
          temperature: null,
          description: 'Ciudad no encontrada',
          icon: null
        });
      }
    } catch (error) {
      console.log(error);
      setClimateData({
        city: null,
        temperature: null,
        description: 'Ciudad no encontrada',
        icon: null
      });
    }
  }

  // efecto 
  useEffect(() => {
    let interval;//definimos intervalo
    if (city) {
      peticion(city);//llamamos a peticion
      interval = setInterval(() => {//creamos intervalo para que se actualize automaticamente
        peticion(city);
      }, 1000000); // Realiza la solicitud cada 60 segundos
    }
    return () => clearInterval(interval); // Limpia el intervalo al desmontar el componente o al cambiar la ciudad
  }, [city]);

  return (
    <div className="App">
      <div className='mobile'>
        {/* Visual */}
        <div className='mobile__container-circle-rectangle'>
          <div className='mobile__circle-left'></div>
          <div className='mobile__rectangle-right'></div>
        </div>
        
        <div className='mobile__button right-up'></div>
        <div className='mobile__button right-down'></div>
        <div className='mobile__button left'></div>
        <div className='mobile__button-circle'></div>

        {/* Pantalla */}
        <div className='screen'>
          {/* header */}
          <header className='header__screen'>
            <div className='header__separete-left'>
              <p>4G</p>
              <FontAwesomeIcon
                icon={faWifi}
                className='icono-wifi'
              />
            </div>
            <div className='header__separete-right'>
              <p>100%</p>
              <FontAwesomeIcon
                icon={faBattery}
                className='icono-battery'
              />
            </div>
          </header>

          {/* fondo de pantalla */}
          <div className='wallpaper'></div>

          {/* Container Info */}
          <section className='section__climate-info'>
            <h1 className='climate-clima'>Clima</h1>
            <h3 className='climate-city'>{climateData.city || 'Ciudad no encontrada'}</h3>
            <p className='climate-celcius'>{climateData.temperature !== null ? `${climateData.temperature}°C` : '---'}</p>
            <p className='climate-description'>{climateData.description}</p>
            <FontAwesomeIcon
              icon={faSun}
              className={`climate-icon ${climateData.icon}`}
            />
            <img
              src={GifArbol}
              className='gif-arbol'
            />
          </section>

          {/* apartado btns siguiente y retroceder */}
          <section className='section-input'>
            <input
              type='text'
              value={valueInput}
              placeholder='Ingresa una ciudad'
              className='climate__input-city'
              onChange={updateValueInput}
              required
            />
            <button className='climate__button-city' onClick={clickButton}>Buscar</button>
          </section>
          
        </div>
      </div>
    </div>
  );
}

export default App;
