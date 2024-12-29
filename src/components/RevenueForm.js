// src/components/RevenueForm.js

import React, { useState } from 'react';
import './RevenueForm.css';

const RevenueForm = ({ onSubmit }) => {
    const [companyName, setCompanyName] = useState('');
    const [revenueData, setRevenueData] = useState([
        { source: '', amount: 0 },
    ]);

    // Thêm một dòng nhập liệu mới
    const addRevenue = () => {
        setRevenueData([...revenueData, { source: '', amount: 0 }]);
    };

    // Xóa một dòng nhập liệu
    const removeRevenue = (index) => {
        const data = [...revenueData];
        data.splice(index, 1);
        setRevenueData(data);
    };

    // Xử lý thay đổi giá trị nhập liệu
    const handleChange = (index, event) => {
        const data = [...revenueData];
        const { name, value } = event.target;
        if (name === 'source') {
            data[index].source = value;
        } else if (name === 'amount') {
            data[index].amount = Number(value);
        }
        setRevenueData(data);
    };

    // Xử lý thay đổi tên công ty
    const handleCompanyNameChange = (event) => {
        setCompanyName(event.target.value);
    };

    // Xử lý submit form
    const handleSubmit = (e) => {
        e.preventDefault();

        if (companyName.trim() === '') {
            alert('Vui lòng nhập tên công ty.');
            return;
        }

        // Lọc và chuyển đổi dữ liệu
        const filteredData = revenueData
            .filter(
                (item) =>
                    item.source.trim() !== '' &&
                    !isNaN(item.amount) &&
                    item.amount >= 0
            );

        if (filteredData.length === 0) {
            alert('Vui lòng nhập ít nhất một nguồn doanh thu hợp lệ.');
            return;
        }

        onSubmit({ companyName, revenues: filteredData });
    };

    return (
        <form className="revenue-form" onSubmit={handleSubmit}>
            <h2>Nhập Số Liệu Doanh Thu</h2>
            <div className="input-group">
                <input
                    type="text"
                    name="companyName"
                    placeholder="Tên Công Ty"
                    value={companyName}
                    onChange={handleCompanyNameChange}
                    required
                />
            </div>
            {revenueData.map((item, index) => (
                <div className="input-group" key={index}>
                    <input
                        type="text"
                        name="source"
                        placeholder="Tên nguồn doanh thu"
                        value={item.source}
                        onChange={(e) => handleChange(index, e)}
                        required
                    />
                    <input
                        type="number"
                        name="amount"
                        placeholder="Số tiền (VNĐ)"
                        min="0"
                        value={item.amount}
                        onChange={(e) => handleChange(index, e)}
                        required
                    />
                    {revenueData.length > 1 && (
                        <button
                            type="button"
                            className="remove-btn"
                            onClick={() => removeRevenue(index)}
                        >
                            X
                        </button>
                    )}
                </div>
            ))}
            <button type="button" className="add-btn" onClick={addRevenue}>
                Thêm Nguồn Doanh Thu
            </button>
            <button type="submit" className="submit-btn">
                Hiển Thị Biểu Đồ
            </button>
        </form>
    );
};

export default RevenueForm;
