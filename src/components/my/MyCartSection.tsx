import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import CartItem from './CartItem';
import cartItemsData from '../../assets/data/cartItems.json';
import serviceData from '../../assets/data/service.json';

const SectionWrapper = styled.div`
  padding: 20px;
  max-width: 1080px;
  margin: 0 auto;
  font-family: sans-serif;
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  border-bottom: 2px solid #e0e0e0;
  padding-bottom: 10px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.th`
  border-bottom: 2px solid #e0e0e0;
  padding: 0 10px 20px 10px;
  text-align: center;
`;

const CartSummary = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  padding: 20px 0 0;
  border-top: 1px solid #e0e0e0;
  font-size: 16px;
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid #e0e0e0;
  margin-bottom: 20px;
`;

const TotalItems = styled.p`
  font-size: 14px;
`;

const TotalPrice = styled.div`
  text-align: right;
`;

const OriginalTotalPrice = styled.p`
  font-size: 14px;
  color: #888;
  text-decoration: line-through;
`;

const FinalPrice = styled.p`
  font-size: 24px;
  font-weight: bold;
  color: #007BFF;
`;

const DiscountAmount = styled.span`
  color: #e74c3c;
  font-weight: bold;
  margin-left: 10px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const Button = styled.button`
  padding: 12px 30px;
  margin-left: 10px;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-size: 16px;
`;

const CheckoutButton = styled(Button)`
  background-color: #202594;
  color: #fff;
`;

const CancelButton = styled(Button)`
  background-color: #fff;
  color: #000;
  border: 1px solid #ccc;
`;

const MyCartSection: React.FC = () => {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  useEffect(() => {
    const itemsWithDetails = cartItemsData.map((cartItem) => {
      const service = serviceData.find((service) => service.id === cartItem.serviceId);
      return {
        ...cartItem,
        service,
      };
    });
    setCartItems(itemsWithDetails);
  }, []);

  const handleSelectItem = (id: number) => {
    setSelectedItems((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((itemId) => itemId !== id)
        : [...prevSelected, id]
    );
  };

  const calculateTotal = () => {
    return cartItems
      .filter((item) => selectedItems.includes(item.id))
      .reduce((total, item) => {
        const price = parseInt(item.service.price.replace(',', ''));
        return total + price;
      }, 0);
  };

  const calculateDiscountTotal = () => {
    return cartItems
      .filter((item) => selectedItems.includes(item.id))
      .reduce((total, item) => {
        const price = parseInt(item.service.price.replace(',', ''));
        const discountPrice = Math.round(price * (1 - item.service.discout));
        return total + discountPrice;
      }, 0);
  };

  return (
    <SectionWrapper>
      <Title>장바구니</Title>
      <Table>
        <thead>
          <tr>
            <TableHeader style={{ width: '50px' }}></TableHeader>
            <TableHeader>상품</TableHeader>
            <TableHeader style={{ width: '150px' }}>금액</TableHeader>
            <TableHeader style={{ width: '120px' }}>배송 내용</TableHeader>
          </tr>
        </thead>
        <tbody>
          {cartItems.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              isSelected={selectedItems.includes(item.id)}
              onSelect={() => handleSelectItem(item.id)}
            />
          ))}
        </tbody>
      </Table>

      <CartSummary>
        <TotalItems>총 상품 개수: {selectedItems.length}개</TotalItems>
        <TotalPrice>
          <OriginalTotalPrice>상품 금액: {calculateTotal().toLocaleString()}원</OriginalTotalPrice>
          <FinalPrice>
            결제 예정 금액: {calculateDiscountTotal().toLocaleString()}원
          </FinalPrice>
        </TotalPrice>
      </CartSummary>

      <Divider />

      <ButtonContainer>
        <CancelButton>선택 결제하기</CancelButton>
        <CheckoutButton>전체 결제하기</CheckoutButton>
      </ButtonContainer>
    </SectionWrapper>
  );
};

export default MyCartSection;