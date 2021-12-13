import { makeRequest } from "./makeRequest";

export async function exportModelToServer(file, reductionValue, selectModels) {
  const formData = new FormData();
  formData.append('model', file);
  const searchParam = new URLSearchParams();
  searchParam.set('-si', reductionValue);

  const res = await makeRequest('POST',
    {
      path: 'compress',
      searchParam
    }, formData);

  console.log('res ', res);
  const option = document.createElement('option');
  option.value = res.fileLink;
  option.innerText = res.fileName;
  selectModels.appendChild(option);
  
  return res;
}