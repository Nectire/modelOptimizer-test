
import {API} from '../API'

export async function exportModelToServer(path, reductionValue, selectModels) {
  const searchParam = new URLSearchParams();
  searchParam.set('-si', reductionValue);

  const res = await new API().compressModelByPath({path: 'compress/' + path, searchParam })

  console.log('res ', res);
  const option = document.createElement('option');
  option.value = res.fileLink;
  option.innerText = res.fileName;
  selectModels.appendChild(option);
  selectModels.value = res.fileLink;
  
  return res;
}