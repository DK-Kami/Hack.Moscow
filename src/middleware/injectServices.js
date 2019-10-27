export default function(apiClient, service) {
  console.log(service);
  Object.defineProperty(service, 'apiClient', {
    value: apiClient,
  });
};
