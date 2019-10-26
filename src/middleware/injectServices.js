export default function(apiClient, service) {
  Object.defineProperty(service, 'apiClient', {
    value: apiClient,
  });
};
