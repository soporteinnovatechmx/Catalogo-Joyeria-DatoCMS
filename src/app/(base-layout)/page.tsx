import { draftMode } from 'next/headers';
import { executeQuery } from '@/lib/datocms/executeQuery';

// 1. CONSULTA: Busca todos los registros del modelo "Joya" con los nombres de campos correctos
const JEWELRY_QUERY = `
  query AllJewelryQuery {
    allJoyas { 
      id
      nombreDelProducto
      precioMxn 
      imagenes { 
        url
        alt
      }
    }
  }
`;

export default async function CatalogPage() {
  const { isEnabled: isDraft } = draftMode();

  // Ejecuta la consulta para obtener la lista de joyas
  // Nota: Las API de DatoCMS convierten los nombres de campos snake_case a camelCase (ej: nombre_del_producto -> nombreDelProducto)
  const { allJoyas } = await executeQuery(JEWELRY_QUERY, {
    isDraft,
  });

  if (!allJoyas || allJoyas.length === 0) {
    // 2. CASO: No hay joyas
    return (
        <div style={{ padding: '40px', textAlign: 'center', backgroundColor: '#222', color: '#fff' }}>
            <h1>Catálogo Vacío</h1>
            <p>El sitio está conectado a DatoCMS, pero no se encontraron registros en el modelo 'Joya'.</p>
            <p>Asegúrate de que los registros estén "Publicados" en DatoCMS.</p>
        </div>
    );
  }

  // 3. VISTA: Muestra el Catálogo
  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ textAlign: 'center', color: '#FFD700', marginBottom: '30px' }}>Nuestro Catálogo de Joyería</h1>
      <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
          gap: '25px' 
      }}>
        {allJoyas.map((joya) => (
          <div 
            key={joya.id} 
            style={{ 
                border: '1px solid #444', 
                borderRadius: '8px', 
                padding: '15px', 
                backgroundColor: '#333', 
                color: '#fff',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)'
            }}
          >
            {/* Imagen de la Joya (toma la primera imagen si es una galería) */}
            {joya.imagenes && joya.imagenes.length > 0 && (
              <img 
                src={joya.imagenes[0].url} // Tomamos la primera imagen
                alt={joya.imagenes[0].alt || joya.nombreDelProducto} 
                style={{ width: '100%', height: 'auto', borderRadius: '4px', marginBottom: '15px' }} 
              />
            )}
            
            {/* Nombre del Producto */}
            <h2 style={{ fontSize: '1.3em', margin: '10px 0', color: '#FFD700' }}>{joya.nombreDelProducto}</h2>
            
            {/* Precio */}
            <p style={{ fontSize: '1.2em', fontWeight: 'bold', color: '#fff' }}>
                Precio: **MXN ${joya.precioMxn ? joya.precioMxn.toFixed(2) : 'N/A'}**
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
