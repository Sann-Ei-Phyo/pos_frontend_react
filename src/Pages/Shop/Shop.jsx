import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Editform from './Editform';
import Deleteform from './Deleteform';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector } from 'react-redux';

const Shop = () => {
  const [shopName, setShopName] = useState('');
  const [datas, setDatas] = useState([]);
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const search = params.get('search');
  const navigate = useNavigate(); 
  const [isEdit, setIsEdit] = useState(false);     
  const [isSave, setIsSave] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [shop, setShop] = useState({
    shopCode: '',
    shopName: '',
    mobileNo: '',
    address: '',
  });
  const { bgColor,cardBgColor} = useSelector((state) => state.animateSlice);
  const [isDelete, setIsDelete] = useState(false);

  const isSuccessfull = useSelector((state) => state.newShopReducer.isSuccessful);

  const searchHandler = () => {
    navigate('/general/shops/?search=' + shopName);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = `https://pos-frontend-next-ruby.vercel.app/api/v1/shops${search ? `?q=${search}` : ''}`;
        const { data:{data:{shops}} } = await axios.get(url);
        setDatas(shops);
        if (isSuccessfull) {
          toast.success("You've successfully added new shop!");
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [search]);

  const changeHandler = (e) => {
    const { name, value } = e;
    setShop((prevShop) => ({
      ...prevShop,
      [name]: value,
    }));
  };

  const discardChanges = () => {
    setIsEdit(false);
    setIsDelete(false);
  };

  const deleteHandler = (id) => {
    setIsDelete(true);
    setCurrentId(id);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const isFormCompleted = Object.values(shop).every(value => value)
    if (isFormCompleted) {
      try {
        const postData = { id: currentId, ...shop };
        const res = await axios.patch(`https://pos-frontend-next-ruby.vercel.app/api/v1/shops/${currentId}`, postData);
        if (res.status === 200) {
          setIsEdit(false);
          toast.success("You've successfully edited the shop!");
          setDatas((prevDatas) =>
            prevDatas.map((item) => {
              if (item.shopId === currentId) {
                return { ...item, ...shop };
              }
              return item;
            })
          );
          }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const deleteShop = async () => {
    try {
      // const res = await axios.delete(`http://localhost:3000/shops/${currentId}`);
      const res = await axios.delete(`https://pos-frontend-next-ruby.vercel.app/api/v1/shops/${currentId}`);
      if (res.status === 202) {
        toast.success("You've successfully deleted the shop!");
        setIsDelete(false);
        setDatas((prevDatas) => prevDatas.filter((shop) => shop.shopId !== currentId));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const editHandler = (index,id) => {
    setCurrentId(id)
    setCurrentIndex(index)
    setIsEdit(true) 
    setShop({
      shopCode :datas[index].shopCode,
      shopName :datas[index].shopName,
      mobileNo :datas[index].mobileNo,
      address : datas[index].address
    })
  }

  console.log(datas);
  return (
    <div className='absolute h-full w-[80%] right-2 top-[70px]'>
      <div style={{background : bgColor}}className='bg-white border-b-2 border-gray-700'>
        <ul className='flex justify-between items-center p-3 mx-auto'>
          <li className='w-full'>
            <div className='flex items-center max-w-sm'>
              <label htmlFor='simple-search' className='sr-only'>
                Search
              </label>
              <div className='relative w-full'>
                <div className='absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none'></div>
                <input
                  type='text'
                  id='simple-search'
                  className='bg-gray-700 border  text-sm rounded-lg block w-full ps-3 p-2.5  border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500'
                  placeholder='Search shop name'
                  required
                  value={shopName} 
                  onChange={(e) => setShopName(e.target.value)}
                />
                {shopName && <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 absolute top-3 right-3" onClick={()=>setShopName('')}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>}
              </div>
              <button
                type='button'
                className='p-2.5 ms-2 text-sm font-medium text-blue-500 bg-gray-700 rounded-lg border border-[#b790ff] hover:bg-gray-50 focus:outline-none focus:ring-[#9055fd]'
                onClick={searchHandler}
              >
                <svg
                  className='w-4 h-4 '
                  aria-hidden='true'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 20 20'
                >
                  <path
                    stroke='#b790ff' 
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z'
                  /> 
                </svg>  
                <span className='sr-only'>Search</span>
              </button>
            </div>
          </li> 
          <li className='w-full text-right'>
            <Link
              to={'/general/shops/newshop'}
              className='py-2.5 px-5 text-sm font-medium text-white focus:outline-none bg-blue-500 rounded-lg  hover:bg-blue-700 hover:text-white focus:z-10 focus:ring-gray-100  '
            >
              Add New Shop
            </Link>
          </li>
        </ul>
      </div>
      <div  style={{background : bgColor}} className='bg-gray-50 h-[100vh] p-5'>
        <div className='max-w-6xl mx-auto flex items-center flex-wrap gap-5'>
          {datas &&
            datas.map((data, i) => (
              <div style={{background : cardBgColor}} key={data.shopId} className='bg-gray-700 border border-gray-600 rounded-md w-[280px] px-4 py-6 space-y-3'>
                <div className='flex items-center justify-between'>
                  <p className='font-bold text-base text-gray-200'>{data.shopName}</p>
                  <div className='flex items-center gap-2'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      strokeWidth={1.5}
                      stroke='currentColor'
                      className='w-4 h-4 text-blue-400 cursor-pointer'
                      onClick={() => editHandler(i, data.shopId)}
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10'
                      />
                    </svg>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      strokeWidth={1.5}
                      stroke='currentColor'
                      className='w-4 h-4 text-red-400 cursor-pointer'
                      onClick={() => deleteHandler(data.shopId)}
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0'
                      />
                    </svg>
                  </div>
                </div>
                <p className='text-sm text-gray-200'>{data.shopCode}</p>
                <p className='text-sm text-gray-200'>{data.address}</p>
                <div className='flex items-center space-x-2'>
                  <div className='p-1 flex items-center justify-center rounded-sm bg-green-400'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" strokeWidth={1.5} stroke="none" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                    </svg>
                  </div>
                  <p className='text-sm font-medium text-gray-200'>{data.mobileNo}</p>
                </div>
              </div>
            ))}
        </div>
      </div>
      {isEdit && ( 
        <Editform
          newShopCode={shop.shopCode}     
          newShopmobileNo={shop.mobileNo}
          newShopName={shop.shopName}
          newShopAddress={shop.address}
          changeHandler={changeHandler}
          discardChanges={discardChanges}
          submitHandler={submitHandler}
          isSave={isSave}
          setIsSave={setIsSave}
        />
      )}
      {isDelete && <Deleteform discardChanges={discardChanges} deleteShop={deleteShop} />}
      <ToastContainer
        position='top-center'
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme='light'
        className='w-[350px]'
      />
    </div>
  );
};
export default Shop;