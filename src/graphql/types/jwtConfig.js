// export const resolveJwtToken = async (auth) => {
//     const token = auth.split(" ")[1]
//     console.log((token));
//     if (!token) {
//       return null
//     }
//     try {
//       const decoded = jwt.verify(token, process.env.SECRET_TOKEN);
//       if (decoded.employeeId) {
//         return decoded.employeeId;
//       } else return null
//     } catch (err) {
//       return null
//     }
//   };