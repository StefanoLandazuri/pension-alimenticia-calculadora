import React, { useState } from 'react';
import './App.css';
import logo from './assets/logo.png';
import WhatsAppButton from './components/WhatsAppButton';
import CornerTip from './components/CornerTip';

// Importa las imágenes para los consejos
import consejo1Img from './assets/ninos.jpg';
import consejo2Img from './assets/alimento.jpg';
import consejo3Img from './assets/asesoria.jpg';

function App() {
  // State for form inputs
  const [monthlyIncome, setMonthlyIncome] = useState('');
  const [isUnemployed, setIsUnemployed] = useState(false);
  const [childrenOver3, setChildrenOver3] = useState('');
  const [childrenUnder3, setChildrenUnder3] = useState('');
  const [hasChildrenOver3, setHasChildrenOver3] = useState(false);
  const [hasChildrenUnder3, setHasChildrenUnder3] = useState(false);
  const [hasDisability, setHasDisability] = useState(false);
  const [disabilityPercentage, setDisabilityPercentage] = useState('');
  const [insuranceType, setInsuranceType] = useState('public');
  const [result, setResult] = useState(null);
  const [showDialog, setShowDialog] = useState(false);

  // Handle calculation
  const calculateSupport = (e) => {
    e.preventDefault();

    // Variables
    const SBU = 470; // Salario Básico Unificado de Ecuador 2025
    const grossIncome = isUnemployed ? SBU : (parseFloat(monthlyIncome) || 0);
    const over3Count = hasChildrenOver3 ? (parseInt(childrenOver3) || 0) : 0;
    const under3Count = hasChildrenUnder3 ? (parseInt(childrenUnder3) || 0) : 0;
    const totalChildren = over3Count + under3Count;
    const disabilityLevel = hasDisability ? disabilityPercentage : "";

    // No podemos calcular sin hijos
    if (totalChildren === 0) {
      alert("Por favor, ingrese al menos un hijo para realizar el cálculo.");
      return;
    }

    // Aplicar descuento del seguro según el tipo seleccionado
    let insurancePercentage = 0;
    switch (insuranceType) {
      case 'private':
        insurancePercentage = 9.45;
        break;
      case 'public':
      case 'police':
        insurancePercentage = 11.45;
        break;
      case 'military':
        insurancePercentage = 13.50;
        break;
      default:
        insurancePercentage = 9.45; // Valor por defecto
    }

    // Calcular el ingreso neto después del descuento del seguro
    const insuranceDiscount = grossIncome * (insurancePercentage / 100);
    const netIncome = grossIncome - insuranceDiscount;

    // Determinar el nivel según los ingresos en términos de SBU
    let level = 0;
    const incomeSBU = netIncome / SBU;

    if (incomeSBU <= 1.25000) {
      level = 1;
    } else if (incomeSBU <= 3.00000) {
      level = 2;
    } else if (incomeSBU <= 4.00000) {
      level = 3;
    } else if (incomeSBU <= 6.50000) {
      level = 4;
    } else if (incomeSBU <= 9.00000) {
      level = 5;
    } else {
      level = 6;
    }

    // Calcular el porcentaje según el nivel, edad y número de hijos
    let percentageOfIncome = 0;

    // Considerar Art. 14: En caso de tener hijos de diferentes edades, 
    // se aplicará el porcentaje correspondiente al derechohabiente de mayor edad.
    const hasOver3 = over3Count > 0;

    // Porcentajes para 1 hijo
    if (totalChildren === 1) {
      if (under3Count === 1) { // 0 a 2 años
        switch (level) {
          case 1: percentageOfIncome = 28.12; break;
          case 2: percentageOfIncome = 34.84; break;
          case 3: percentageOfIncome = 38.49; break;
          case 4: percentageOfIncome = 39.79; break;
          case 5: percentageOfIncome = 41.14; break;
          case 6: percentageOfIncome = 42.53; break;
          default: percentageOfIncome = 28.12; // valor por defecto
        }
      } else { // 3 años en adelante
        switch (level) {
          case 1: percentageOfIncome = 29.49; break;
          case 2: percentageOfIncome = 36.96; break;
          case 3: percentageOfIncome = 40.83; break;
          case 4: percentageOfIncome = 42.21; break;
          case 5: percentageOfIncome = 43.64; break;
          case 6: percentageOfIncome = 45.12; break;
          default: percentageOfIncome = 29.49; // valor por defecto
        }
      }
    }
    // Porcentajes para 2 hijos
    else if (totalChildren === 2) {
      // Según Art. 14, si hay hijos mayores de 3 años, aplicamos ese porcentaje
      if (hasOver3) { // Al menos un hijo de 3 años o más
        switch (level) {
          case 1: percentageOfIncome = 43.13; break;
          case 2: percentageOfIncome = 49.51; break;
          // Para nivel 3+ usamos los valores específicos de cada nivel para 1 hijo
          case 3: percentageOfIncome = 40.83; break; // Valor del nivel 3 para 1 hijo mayor de 3 años
          case 4: percentageOfIncome = 42.21; break; // Valor del nivel 4 para 1 hijo mayor de 3 años
          case 5: percentageOfIncome = 43.64; break; // Valor del nivel 5 para 1 hijo mayor de 3 años
          case 6: percentageOfIncome = 45.12; break; // Valor del nivel 6 para 1 hijo mayor de 3 años
          default: percentageOfIncome = 43.13; // valor por defecto
        }
      } else { // Todos los hijos menores de 3 años
        switch (level) {
          case 1: percentageOfIncome = 39.71; break;
          case 2: percentageOfIncome = 47.45; break;
          // Para nivel 3+ usamos los valores específicos de cada nivel para 1 hijo
          case 3: percentageOfIncome = 38.49; break; // Valor del nivel 3 para 1 hijo menor de 3 años
          case 4: percentageOfIncome = 39.79; break; // Valor del nivel 4 para 1 hijo menor de 3 años
          case 5: percentageOfIncome = 41.14; break; // Valor del nivel 5 para 1 hijo menor de 3 años
          case 6: percentageOfIncome = 42.53; break; // Valor del nivel 6 para 1 hijo menor de 3 años
          default: percentageOfIncome = 39.71; // valor por defecto
        }
      }
    }
    // Porcentajes para 3 o más hijos
    else if (totalChildren >= 3) {
      // Según Art. 14, si hay hijos mayores de 3 años, aplicamos ese porcentaje
      if (hasOver3) { // Al menos un hijo de 3 años o más
        switch (level) {
          case 1: percentageOfIncome = 54.23; break;
          // Para otros niveles usamos los valores específicos de cada nivel para 1 hijo
          case 2: percentageOfIncome = 49.51; break; // Valor del nivel 2 para 1 hijo mayor de 3 años valor max
          case 3: percentageOfIncome = 40.83; break; // Valor del nivel 3 para 1 hijo mayor de 3 años
          case 4: percentageOfIncome = 42.21; break; // Valor del nivel 4 para 1 hijo mayor de 3 años
          case 5: percentageOfIncome = 43.64; break; // Valor del nivel 5 para 1 hijo mayor de 3 años
          case 6: percentageOfIncome = 45.12; break; // Valor del nivel 6 para 1 hijo mayor de 3 años
          default: percentageOfIncome = 54.23; // valor por defecto
        }
      } else { // Todos los hijos menores de 3 años
        switch (level) {
          case 1: percentageOfIncome = 52.18; break;
          // Para otros niveles usamos los valores específicos de cada nivel para 1 hijo
          case 2: percentageOfIncome = 47.45; break; // Valor del nivel 2 para 1 hijo menor de 3 años
          case 3: percentageOfIncome = 38.49; break; // Valor del nivel 3 para 1 hijo menor de 3 años
          case 4: percentageOfIncome = 39.79; break; // Valor del nivel 4 para 1 hijo menor de 3 años
          case 5: percentageOfIncome = 41.14; break; // Valor del nivel 5 para 1 hijo menor de 3 años
          case 6: percentageOfIncome = 42.53; break; // Valor del nivel 6 para 1 hijo menor de 3 años
          default: percentageOfIncome = 52.18; // valor por defecto
        }
      }
    }

    // Adicional por discapacidad (si aplica)
    let disabilitySupport = 0;
    if (disabilityLevel) {
      // Valores en términos de SBU según la tabla
      if (disabilityLevel >= "30" && disabilityLevel <= "49") {
        switch (level) {
          case 1: disabilitySupport = 4.56; break;
          case 2: disabilitySupport = 10.68; break;
          case 3: disabilitySupport = 18.23; break;
          case 4: disabilitySupport = 25.54; break;
          case 5: case 6: disabilitySupport = 30.43; break;
          default: disabilitySupport = 4.56; // valor por defecto
        }
      } else if (disabilityLevel >= "50" && disabilityLevel <= "74") {
        switch (level) {
          case 1: disabilitySupport = 5.23; break;
          case 2: disabilitySupport = 12.26; break;
          case 3: disabilitySupport = 20.92; break;
          case 4: disabilitySupport = 29.30; break;
          case 5: case 6: disabilitySupport = 34.92; break;
          default: disabilitySupport = 5.23; // valor por defecto
        }
      } else if (disabilityLevel >= "75" && disabilityLevel <= "100") {
        switch (level) {
          case 1: disabilitySupport = 6.63; break;
          case 2: disabilitySupport = 15.55; break;
          case 3: disabilitySupport = 26.53; break;
          case 4: disabilitySupport = 37.16; break;
          case 5: case 6: disabilitySupport = 44.28; break;
          default: disabilitySupport = 6.63; // valor por defecto
        }
      }
    }

    // Calcular el monto de la pensión alimenticia (se basa en el ingreso neto)
    const supportAmount = (netIncome * (percentageOfIncome / 100)).toFixed(2);

    // Calcular el monto adicional por discapacidad (en términos de SBU)
    const disabilityAmount = (disabilitySupport * SBU / 100).toFixed(2);

    // Calcular el monto total
    const totalAmount = (parseFloat(supportAmount) + parseFloat(disabilityAmount)).toFixed(2);

    // Calcular monto por hijo
    const perChildAmount = (totalAmount / totalChildren).toFixed(2);

    // Establecer el resultado
    setResult({
      grossIncome: grossIncome.toFixed(2),
      insuranceType: insuranceType,
      insurancePercentage: insurancePercentage.toFixed(2),
      insuranceDiscount: insuranceDiscount.toFixed(2),
      netIncome: netIncome.toFixed(2),
      totalAmount: totalAmount,
      supportAmount: supportAmount,
      disabilityAmount: disabilityAmount,
      perChildAmount: perChildAmount,
      totalChildren: totalChildren,
      level: level,
      percentageOfIncome: percentageOfIncome.toFixed(2),
      SBU: SBU.toFixed(2),
      incomeSBU: incomeSBU.toFixed(2),
      hasChildrenUnder3: under3Count > 0,
      hasChildrenOver3: over3Count > 0,
      appliedArt14: (under3Count > 0 && over3Count > 0) ? "Sí" : "No"
    });

    // Mostrar el diálogo con resultados
    setShowDialog(true);
  };

  return (
    <div className="app">
      <header>
        <div className="logo-container">
          <img src={logo} alt="Charry Sáenz Jácome & Galarza Estudio Jurídico" className="logo" />
        </div>
      </header>

      <main className="calculator-container">
        {/* Consejos en las esquinas - REEMPLAZA LOS TEXTOS Y LAS IMÁGENES SEGÚN NECESITES */}
        <CornerTip
          position="top-left"
          title="💡"
          content="Recuerda que la pensión de alimentos se debe desde la presentación de la demanda."
          imageSrc={consejo1Img}
        />

        <CornerTip
          position="top-right"
          title="💡"
          content="El derecho de alimentos puede ser solicitado incluso si el hijo y el obligado conviven bajo el mismo techo."
          imageSrc={consejo2Img}
        />

        <CornerTip
          position="bottom-left"
          title="💡"
          content="El derecho de alimentos lo puedo solicitar el padre o la madre a cuyo cuidado se encuentre el hijo."
          imageSrc={consejo3Img}
        />

        <h1>Calculadora de Pensiones Alimenticias</h1>
        <p className="subtitle">Esta simulación estima la manutención según las leyes ecuatorianas.</p>

        <form className="calculator-form" onSubmit={calculateSupport}>
          <div className="form-columns">
            <div className="form-column">
              <div className="form-row">
                <label htmlFor="monthlyIncome">Sueldo Mensual del alimentante ($):</label>
                <input
                  type="number"
                  id="monthlyIncome"
                  placeholder="Escribe aquí..."
                  value={isUnemployed ? "470" : monthlyIncome}
                  onChange={(e) => setMonthlyIncome(e.target.value)}
                  required
                  disabled={isUnemployed}
                />
              </div>

              <div className="form-row">
                <div className="checkbox-container">
                  <input
                    type="checkbox"
                    id="isUnemployed"
                    checked={isUnemployed}
                    onChange={(e) => {
                      setIsUnemployed(e.target.checked);
                      if (e.target.checked) {
                        setMonthlyIncome('470');
                        setInsuranceType('public');
                      }
                    }}
                  />
                  <label htmlFor="isUnemployed" className="checkbox-label">Si el alimentante no trabaja ni tiene ingresos marque aquí</label>
                </div>
              </div>

              <div className="form-row">
                <div className="checkbox-container">
                  <input
                    type="checkbox"
                    id="hasChildrenOver3"
                    checked={hasChildrenOver3}
                    onChange={(e) => {
                      setHasChildrenOver3(e.target.checked);
                      if (!e.target.checked) {
                        setChildrenOver3('');
                      }
                    }}
                  />
                  <label htmlFor="hasChildrenOver3" className="checkbox-label">Tiene hijos mayores de 3 años</label>
                </div>

                {hasChildrenOver3 && (
                  <div className="indented-input">
                    <label htmlFor="childrenOver3">¿Cuántos hijos mayores a 3 años tiene?</label>
                    <input
                      type="number"
                      id="childrenOver3"
                      placeholder="Escribe aquí..."
                      value={childrenOver3}
                      onChange={(e) => {
                        const value = e.target.value;
                        // Solo permite valores entre 1 y 9
                        if (value === '' || (parseInt(value) >= 1 && parseInt(value) <= 9)) {
                          setChildrenOver3(value);
                        }
                      }}
                      min="1"
                      max="9"
                    />
                  </div>
                )}
              </div>

              <div className="form-row">
                <div className="checkbox-container">
                  <input
                    type="checkbox"
                    id="hasChildrenUnder3"
                    checked={hasChildrenUnder3}
                    onChange={(e) => {
                      setHasChildrenUnder3(e.target.checked);
                      if (!e.target.checked) {
                        setChildrenUnder3('');
                      }
                    }}
                  />
                  <label htmlFor="hasChildrenUnder3" className="checkbox-label">Tiene hijos entre 0 y 2 años</label>
                </div>

                {hasChildrenUnder3 && (
                  <div className="indented-input">
                    <label htmlFor="childrenUnder3">¿Cuántos hijos menores a 3 años tiene?</label>
                    <input
                      type="number"
                      id="childrenUnder3"
                      placeholder="Escribe aquí..."
                      value={childrenUnder3}
                      onChange={(e) => {
                        const value = e.target.value;
                        // Solo permite valores entre 1 y 9
                        if (value === '' || (parseInt(value) >= 1 && parseInt(value) <= 9)) {
                          setChildrenUnder3(value);
                        }
                      }}
                      min="1"
                      max="9"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="form-column">
              {/* Selector para el tipo de seguro movido al lado derecho */}
              <div className="form-row">
                <label htmlFor="insuranceType">Escoja si el/la alimentante es:</label>
                <select
                  id="insuranceType"
                  value={insuranceType}
                  onChange={(e) => setInsuranceType(e.target.value)}
                  disabled={isUnemployed}
                >
                  <option value="private">Trabajador Privado</option>
                  <option value="public">Funcionario Público</option>
                  <option value="police">Policía</option>
                  <option value="military">Militar</option>
                </select>
              </div>

              <div className="form-row disability-row">
                <div className="checkbox-container">
                  <input
                    type="checkbox"
                    id="hasDisability"
                    checked={hasDisability}
                    onChange={(e) => {
                      setHasDisability(e.target.checked);
                      if (!e.target.checked) {
                        setDisabilityPercentage('');
                      }
                    }}
                  />
                  <label htmlFor="hasDisability" className="checkbox-label">
                    Tiene hijos con discapacidad
                  </label>
                </div>

                {hasDisability && (
                  <div className="indented-input">
                    <label htmlFor="disabilityPercentage">
                      Marque el porcentaje que corresponde al nivel de inhabilitación del menor de edad.
                    </label>
                    <select
                      id="disabilityPercentage"
                      value={disabilityPercentage}
                      onChange={(e) => setDisabilityPercentage(e.target.value)}
                    >
                      <option value="">Indique el porcentaje</option>
                      <option value="30">30% - 49%</option>
                      <option value="50">50% - 69%</option>
                      <option value="70">70% - 84%</option>
                      <option value="85">85% - 100%</option>
                    </select>
                  </div>
                )}
              </div>


            </div>
          </div>

          <button type="submit" className="calculate-button">Calcular</button>
          <br></br>
          <p className='aviso'>*Descargo de responsabilidad: Esta calculadora es una herramienta gratuita y referencial, diseñada únicamente con fines informativos. Los valores generados no constituyen asesoría legal, ni implican garantía alguna sobre montos definitivos que puedan fijarse como pensión alimenticia en un caso concreto.</p>
        </form>

        {/* Results Dialog */}
        {showDialog && result && (
          <div className="dialog-overlay">
            <div className="dialog-container">
              <div className="dialog-content">
                {/* Marca de agua (logo) */}
                <div className="watermark"></div>

                <h2>Resultado del Cálculo</h2>
                <div className="result-info">
                  <p><strong>Ingresos brutos del alimentante:</strong> ${result.grossIncome}</p>
                  <p><strong>Ingresos netos (después del descuento):</strong> ${result.netIncome}</p>
                  <p><strong>Nivel aplicado:</strong> {result.level} ({result.incomeSBU} SBU)</p>
                  <p><strong>Porcentaje aplicado:</strong> {result.percentageOfIncome}%</p>
                  {parseFloat(result.disabilityAmount) > 0 && (
                    <p><strong>Adicional por discapacidad:</strong> ${result.disabilityAmount}</p>
                  )}
                  <p><strong>Pensión alimenticia total:</strong> ${result.totalAmount}</p>
                  <p><strong>Monto por hijo:</strong> ${result.perChildAmount}</p>
                  <p><strong>Número de hijos:</strong> {result.totalChildren}</p>
                </div>
                <p className="result-note">
                  Cálculo basado en la tabla de pensiones alimenticias mínimas 2025 con un SBU de ${result.SBU}.
                </p>
                <div className='action-buttons'>
                  <WhatsAppButton />
                  <button
                    className="close-dialog-button"
                    onClick={() => setShowDialog(false)}
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <p className="result-note">
          {!result && "El resultado de la calculadora se divide entre el número de hijos en el proceso de alimentos."}
        </p>
      </main>

      <footer>
        <p>© {new Date().getFullYear()} Charry Sáenz Jácome & Galarza - Estudio Jurídico</p>
      </footer>
    </div>
  );
}

export default App;