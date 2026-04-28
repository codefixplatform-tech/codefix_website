import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, name = "Codefix", type = "website" }) => {
  return (
    <Helmet>
      {/* Standard metadata tags */}
      <title>{title ? `${title} | ${name}` : name}</title>
      <meta name='description' content={description} />
      
      {/* Open Graph tags (Facebook/LinkedIn) */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title || name} />
      <meta property="og:description" content={description} />
      
      {/* Twitter tags */}
      <meta name="twitter:creator" content={name} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title || name} />
      <meta name="twitter:description" content={description} />
    </Helmet>
  );
};

export default SEO;
