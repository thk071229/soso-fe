// src/component/common/Stepper/Stepper.jsx
import React from 'react';
import styles from './Stepper.module.css';

const Stepper = ({ steps, currentStep }) => {
    
    // 진행률 계산 (게이지 바 너비)
    // 단계가 3개면: 0단계(0%), 1단계(50%), 2단계(100%)
    const progressWidth = (currentStep / (steps.length - 1)) * 100;

    return (
        <div className={styles.container}>
            {/* 배경 선 */}
            <div className={styles.track}></div>
            
            {/* 진행된 색상 선 */}
            <div 
                className={styles.progress} 
                style={{ width: `${progressWidth}%` }}
            ></div>

            {/* 단계별 원과 라벨 */}
            {steps.map((label, index) => (
                <div 
                    key={index} 
                    className={`${styles.stepItem} ${index <= currentStep ? styles.active : ''}`}
                >
                    <div className={styles.circle}>
                        {/* 체크 표시 아이콘을 넣어도 좋고, 그냥 숫자를 넣어도 됨 */}
                        {index + 1}
                    </div>
                    <div className={styles.label}>{label}</div>
                </div>
            ))}
        </div>
    );
};

export default Stepper;