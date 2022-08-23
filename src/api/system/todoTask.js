import { toActions } from "@/utils/httpAction"

const baseUrl = "/system/todoTask";

export default toActions({
    listTodoTask:         `POST ${baseUrl}/list`,                   // 查询待办任务列表
    getTodoTask:          `GETS ${baseUrl}`,                        // 查询待办任务详细
    addTodoTask:          `POST ${baseUrl}`,                        // 新增待办任务
    updateTodoTask:       `PUT ${baseUrl}`,                         // 修改待办任务
    delTodoTask:          `DELETES ${baseUrl}`,                     // 删除待办任务
    getTypeCount:         `GET ${baseUrl}/getTypeCount`,            // 获取指定用户的各代办任务数量
    getStateCountByType:  `GETS ${baseUrl}/getStateCountByType`,    // 获取指定用户的某项任务类型代办状况
    removeByHook:         `DELETES ${baseUrl}/removeByHook`,        // 批量删除待办任务 (通过钩子)
    receiveTodo:          `POST ${baseUrl}/batchReceiveTodo`,       // 批量接收代办任务
    processDoneByHook:    `POSTU ${baseUrl}/processDoneByHook`,     // 批量处理代办变为已办（通过钩子）
    processRestartByHook: `POSTU ${baseUrl}/processRestartByHook`,  // 批量重新开启已办任务（通过钩子）
})