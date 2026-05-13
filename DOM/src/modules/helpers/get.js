export const get = async(url) => {
  const solicitud= await  fetch(`http://10.5.225.161:3001/${url}`);
  if (!solicitud.ok) {
    return null;
  }
  const data = await solicitud.json();
  return data;
}