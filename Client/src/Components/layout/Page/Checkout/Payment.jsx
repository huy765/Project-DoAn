import React, { useState, useContext, useEffect } from "react";
import { Form, Button, Row, Input, Radio, Space } from "antd";
import { useHistory } from "react-router-dom";

import "../../../Style/payment.css";
import Header from "../Header/Header";
import { AuthContext } from "../../../../Store/Context/AuthContext";
import { CardContext } from "../../../../Store/Context/CardContext";
import { PaymentContext } from "../../../../Store/Context/PaymentContext";
import { OrderContext } from "../../../../Store/Context/OrderContext";

const Payment = () => {
    const history = useHistory();
    const [payment, setPayment] = useState(1);
    const {
        cardState: { cards, sumMoney },
        getSumMoneyCard,
    } = useContext(CardContext);
    const {
        authState: { user },
    } = useContext(AuthContext);
    const {
        paymentState: { payments },
        getPayment,
    } = useContext(PaymentContext);

    const {
        orderState: { orders },
        createOrder,
    } = useContext(OrderContext);

    const onChange = (e) => {
        setPayment(e.target.value);
    };

    useEffect(async () => {
        getSumMoneyCard();
    }, []);
    useEffect(async () => {
        getPayment();
    }, []);

    const onFinish = async (address) => {
        const infoPayment = {
            idCard: user[0].idCard,
            idCustomer: user[0].id,
            address: address,
            sumPayment: sumMoney,
            idPayment: payment,
        };
        console.log(infoPayment);
        await createOrder(infoPayment);
        history.push({ pathname: "/success", state: { info: infoPayment } });
    };

    return (
        <>
            <Header />
            <div className='main-Payment'>
                <div className='box-left'>
                    <div className='flex-left'>
                        <h2 className='title'>Thông tin thanh toán</h2>
                        <Form
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                            layout='vertical'
                            hideRequiredMark
                            onFinish={onFinish}
                            initialValues={{
                                ["fullname"]: user[0].fullname,
                                ["phone"]: user[0].phone,
                                ["email"]: user[0].email,
                                ["address"]: user[0].address,
                            }}
                        >
                            <Row gutter={16}>
                                <Form.Item
                                    label='Họ và tên'
                                    name='fullname'
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Trường này không được để trống",
                                        },
                                    ]}
                                >
                                    <Input
                                        size='large'
                                        style={{ width: 505 }}
                                        placeholder='Họ và tên'
                                        // placeholder={user[0].fullname}
                                    />
                                </Form.Item>
                            </Row>
                            <Row gutter={16}>
                                <Form.Item
                                    label='Số điện thoại'
                                    name='phone'
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Trường này không được để trống",
                                        },
                                    ]}
                                >
                                    <Input
                                        size='large'
                                        style={{ width: 505 }}
                                        placeholder='Số điện thoại'
                                    />
                                </Form.Item>
                            </Row>
                            <Row gutter={16}>
                                <Form.Item
                                    label='Email'
                                    name='email'
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Trường này không được để trống",
                                        },
                                    ]}
                                >
                                    <Input
                                        size='large'
                                        style={{ width: 505 }}
                                        placeholder='Email'
                                    />
                                </Form.Item>
                            </Row>
                            <Row gutter={16}>
                                <Form.Item
                                    label='Địa chỉ nhận hàng'
                                    name='address'
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Trường này không được để trống",
                                        },
                                    ]}
                                >
                                    <Input
                                        size='large'
                                        style={{ width: 505 }}
                                        placeholder='Địa chỉ'
                                    />
                                </Form.Item>
                            </Row>
                        </Form>
                    </div>
                    <div className='flex-right'>
                        <h2 className='title'>Vận chuyển</h2>
                        <div
                            className='delivery'
                            style={{
                                width: 388,
                                height: 58,
                                border: "1px solid gray",
                                borderRadius: 10,
                                display: "flex",
                                justifyContent: "center",
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                <div
                                    className='img-tic-xanh'
                                    style={{
                                        width: 20,
                                        height: 20,
                                        marginRight: 15,
                                    }}
                                >
                                    <svg
                                        xmlns='http://www.w3.org/2000/svg'
                                        fill='none'
                                        viewBox='0 0 24 24'
                                        stroke='currentColor'
                                        style={{ color: "green" }}
                                    >
                                        <path d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'></path>
                                    </svg>
                                </div>
                                <strong
                                    style={{ marginLeft: 20, marginRight: 72 }}
                                >
                                    Giao hàng tận nơi
                                </strong>
                                <div
                                    className='price-delivery'
                                    style={{ color: "red" }}
                                >
                                    35000 đ
                                </div>
                            </div>
                        </div>
                        <h2 className='title'>Phương thức thanh toán</h2>
                        <div className='choice-payment'>
                            <Radio.Group onChange={onChange} value={payment}>
                                <Space direction='vertical' key={"1"}>
                                    {payments.map((item, index) => {
                                        return (
                                            <Radio
                                                style={{
                                                    height: 58,
                                                    width: 388,
                                                    border: "1px solid gray",
                                                    borderRadius: 15,
                                                    display: "flex",
                                                    paddingLeft: 20,
                                                    alignItems: "center",
                                                }}
                                                value={item.id}
                                                key={index}
                                            >
                                                {item.tenphuongthuc}
                                            </Radio>
                                        );
                                    })}
                                </Space>
                            </Radio.Group>
                        </div>
                    </div>
                </div>
                <div className='box-right'>
                    <div className='TitlePayment'>
                        <h3>Đơn hàng</h3>
                    </div>
                    {cards.map((item, index) => {
                        return (
                            <>
                                <div
                                    className='itemBuy'
                                    key={index}
                                    style={{ margin: 10 }}
                                >
                                    <div className='itemBuy-detail'>
                                        <div className='imgProduct'>
                                            <img
                                                src={`http://localhost:8080/image/procuct/${item.image}`}
                                                alt=''
                                                style={{
                                                    width: 60,
                                                    height: 60,
                                                    borderRadius: 10,
                                                }}
                                            />
                                        </div>
                                        <div className='infomation'>
                                            <div className='infomation-left'>
                                                <h3>{item.nameProduct}</h3>
                                                <div
                                                    style={{
                                                        color: "gray",
                                                        marginTop: 8,
                                                    }}
                                                >
                                                    {item.quantity} Sản phẩm
                                                </div>
                                            </div>
                                            <div
                                                className='infomation-right'
                                                style={{ position: "relative" }}
                                            >
                                                <h3>
                                                    {" "}
                                                    {item.quantity *
                                                        item.price}{" "}
                                                    đ
                                                </h3>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        );
                    })}

                    <div className='detail-Order'>
                        <div className='sumMoney'>
                            <h2
                                className='title-money'
                                style={{ margin: 0, position: "relative" }}
                            >
                                <strong>Tạm tính : </strong>
                                <span
                                    style={{
                                        color: "red",
                                        marginLeft: 90,
                                        position: "absolute",
                                        right: 0,
                                    }}
                                >
                                    {sumMoney !== null ? sumMoney : "0"} đ
                                </span>
                            </h2>
                            <h2 style={{ margin: 0, position: "relative" }}>
                                <strong>Phí vận chuyển : </strong>
                                <span
                                    style={{
                                        color: "red",
                                        marginLeft: 90,
                                        position: "absolute",
                                        right: 0,
                                    }}
                                >
                                    35000 đ
                                </span>
                            </h2>

                            <h2 style={{ margin: 0, position: "relative" }}>
                                <strong>Tổng thanh toán : </strong>
                                <span
                                    style={{
                                        color: "red",
                                        marginLeft: 90,
                                        position: "absolute",
                                        right: 0,
                                    }}
                                >
                                    {35000 + sumMoney} đ
                                </span>
                            </h2>
                        </div>
                        <div className='btn-action-block'>
                            <Button
                                style={{ marginBottom: 20 }}
                                type='primary'
                                className='btn-buy'
                                onClick={(e) =>
                                    onFinish(
                                        user[0].fullname,
                                        user[0].phone,
                                        user[0].email,
                                        user[0].address
                                    )
                                }
                            >
                                Đặt hàng
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Payment;
