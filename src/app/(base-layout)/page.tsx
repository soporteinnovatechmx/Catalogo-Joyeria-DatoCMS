import { isDraftMode } from 'next/dist/client/components/app-router';
import { executeQuery } from '@/lib/datocms/executeQuery';

// Define tu consulta GraphQL (asumiendo que tienes un modelo llamado 'AllPages' o similar)
const PAGE_QUERY = `
  query PageQuery {
    page(filter: {slug: {eq: "home"}}) {
      title
      content {
        value
      }
    }
    _site {
      favicon: faviconMetaTags {
        attributes
        content
        tag
      }
    }
  }
`;

export default async function IndexPage() {
  const isDraft = isDraftMode();

  const { page } = await executeQuery(PAGE_QUERY, {
    isDraft,
  });

  if (!page) {
    // Muestra un mensaje si no encuentra el contenido en DatoCMS
    return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
            <h1>¡El sitio funciona!</h1>
            <p>El código se conectó a DatoCMS, pero no se encontró la página con el slug 'home'.</p>
            <p>Crea una página en DatoCMS con el slug "home" o ajusta el código.</p>
        </div>
    );
  }

  // Si encuentra la página, muestra el título
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>{page.title}</h1>
      {/* Aquí podrías renderizar el contenido usando un componente de bloques */}
      <p>¡El sitio está en línea y conectado a DatoCMS!</p>
    </div>
  );
}
