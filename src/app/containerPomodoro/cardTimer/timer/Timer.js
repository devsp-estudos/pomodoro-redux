import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { MdSettings, MdAlarm } from 'react-icons/md' // MdAlarmOff
import { useDispatch } from 'react-redux'
import { pomodoro } from '../../../../store/actions'
import Horizontal from '../../../components/Horizontal'
import BtnIcon from '../../../components/BtnIcon'
import Button from '../../../components/Button'
import ModalEditTimer from './ModalEditTimer'


const setPageTitle = newTitle => document.title = newTitle

const convertTimer = {
    int: (timer) => {
        const arrayTimer = timer.split(':')

        const min = parseInt(arrayTimer[0])
        const seg = parseInt(arrayTimer[1])

        return { min, seg }
    },

    string: (min, seg) => {

        if (min < 10 && min >= 0) min = `0${min}`
        if (seg < 10) seg = `0${seg}`

        return `${min}:${seg}`
    }
}

const calcTimer = (timer, initialTimer) => {
    const { min, seg } = convertTimer.int(timer)
    const { min: minInit, seg: segInit } = convertTimer.int(initialTimer)

    if (min < 0) {
        const newMin = minInit + (min * -1 - 1)
        const newSeg = segInit + (60 - seg)

        return convertTimer.string(newMin, newSeg)
    }

    return initialTimer
}

const timerDecrement = time => {
    let { min, seg } = convertTimer.int(time)

    if (seg === 0) {
        min -= 1;
        seg = 60;
    }

    seg -= 1

    return { min, seg }
}


function Timer({ obj }) {

    useEffect(() => {
        if (oldObj.indicator !== obj.indicator && idInterval !== '') {
            dispatch(pomodoro.time(oldObj.indicator, timer, false))
            resetTimer()
        }

        if (oldObj.indicator !== obj.indicator) {
            setTimer(obj.time || objTimer.pomodoro)
            setOldObj(obj)
        }
    }, [obj])
    // }, [dispatch, obj, oldObj, idInterval, resetTimer, timer])

    const dispatch = useDispatch()


    // ------------- Modal Timer -------------  
    const [modalTimer, setModalTimer] = useState(false)
    const openModalTimer = () => setModalTimer(true)
    const closeModalTimer = () => setModalTimer(false)

    const [objTimer, setObjTimer] = useState({
        pomodoro: localStorage.getItem('pomodoro') || '25:00',
        rest: localStorage.getItem('rest') || '05:00'
    })

    const defineObjTimer = (pomodoroTime = '25:00', restTime = '05:00') => {
        const pomodoro = pomodoroTime
        const rest = restTime

        localStorage.setItem('pomodoro', pomodoro)
        localStorage.setItem('rest', rest)

        setObjTimer({ pomodoro, rest })

        if (idInterval === '') setTimer(pomodoro)
    }


    // ------------- Timer State -------------  
    const [oldObj, setOldObj] = useState(obj)
    const [timer, setTimer] = useState(objTimer.pomodoro)
    const [idInterval, setIdInterval] = useState('')
    const [reset, setReset] = useState(false)
    const [conclude, setConclude] = useState(false)


    // ------------- Timer Functions -------------  
    const changeTimer = () => setTimer(time => {

        const { min, seg } = timerDecrement(time)

        if (min <= 0 && seg === 0) {
            console.log('tocar alerta, seg: ', seg)
            setConclude(true)
        }

        const newTimer = convertTimer.string(min, seg)

        setPageTitle(`${obj.indicator}) ${newTimer}`)

        return newTimer
    })

    const startTimer = () => {
        if (idInterval !== '') return
        if (timer.slice(0, 1) === '-') setConclude(true)

        const id = setInterval(changeTimer, 1000)
        setIdInterval(id)
        setReset(false)
    }

    const pauseTimer = () => {
        clearTimeout(idInterval)
        setIdInterval('')
        if (timer !== objTimer.pomodoro) setReset(true)
        setConclude(false)
    }

    const resetTimer = () => {
        clearTimeout(idInterval)
        setIdInterval('')
        setTimer(objTimer.pomodoro)
        setPageTitle('Pomodoro')
        setReset(false)
        setConclude(false)
    }

    const concludePomodoro = () => {
        const time = calcTimer(timer, objTimer.pomodoro)
        dispatch(pomodoro.time(obj.indicator, time, true))
        resetTimer()
    }


    return (
        <Container>
            <Horizontal width='100%' margin='0 0 20px 0' justify='center' position='relative'>
                <BtnIcon onClick={openModalTimer} className='settings' width='36px' height='36px' background='#F5F5F5' shadow>
                    <MdSettings size='24' />
                </BtnIcon>

                <Horizontal position='relative'>
                    <h2>{timer}</h2>

                    <BtnIcon className='clock' width='36px' height='36px' background='#F5F5F5' shadow>
                        <MdAlarm size='24' />
                    </BtnIcon>
                </Horizontal>
            </Horizontal>

            <Horizontal>
                {(conclude) ?
                    <Button onClick={concludePomodoro} text='CONCLUIR' background='#4EB089' color='white' /> :
                    <Button onClick={startTimer} text='INICIAR' background='#4EB089' color='white' />
                }

                {(reset) ?
                    <Button onClick={resetTimer} text='ZERAR' /> :
                    <Button onClick={pauseTimer} text='PARAR' />
                }
            </Horizontal>

            {modalTimer && <ModalEditTimer closeModal={closeModalTimer} objTimer={objTimer} defineObjTimer={defineObjTimer} convertTimer={convertTimer} />}
        </Container>
    )
}

const Container = styled.div`
    height: 170px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    
    h2 {
        color: #343434;
        font-family: monospace; 
        font-size: 44px;
        cursor: default;
    }

    .settings {
        position: absolute;
        top: -10px; left: 14px;
    }

    .clock {
        position: absolute;
        top: 5px; right: -55px;
    }
`

export default Timer
