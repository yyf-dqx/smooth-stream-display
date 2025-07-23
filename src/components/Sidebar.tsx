import {useEffect, useRef, useState} from 'react'
import ConfigPanel from './ConfigPanel'
import './index.less'
import {queryAgentConfigValue, saveConfig} from '@/request/reqapi/home'
import {Form, Input, message, Select} from 'antd'
import PluginModal from './component/PluginModal'
import ModelModal from './component/ModelModal'
import FileUploadModal from './component/FileUpload'
import PluginIcon from '@/assets/icons/plugin.svg'
import DeleteIcon from '@/assets/icons/delete.svg'
import KnowledgeBaseModal from './component/KnowledgeBaseModal'
import type {
  ConfigItem,
  DataBaseItem,
  EventInfo,
  PluginItem,
  SaveConfigParams,
  ModelInfo,
} from '@/request/reqapi/home/index.type'
import SqlModal from './component/SqlModal'
interface SidebarProps {
  mallItem: any
  onEventClick: (info: any, agentCode: string) => void
}
const Sidebar: React.FC<SidebarProps> = ({mallItem, onEventClick}) => {
  // 添加 modal 状态管理
  // const [form] = Form.useForm()
  const formRef = useRef<any>(null)
  const [modalConfig, setModalConfig] = useState<{
    visible: boolean
    title: string
    code: string
  }>({
    visible: false,
    title: '',
    code: '',
  })
  // 初始化配置项（isShow 默认为 false）
  const initialConfigItems: ConfigItem[] = [
    {
      title: '插件',
      code: 'plugin',
      isShow: false,
      onAdd: () => {
        setModalConfig({
          visible: true,
          title: '插件',
          code: 'plugin',
        })
      },
      children: null,
      showEdit: false,
    },
    {
      title: '知识库',
      code: 'knowledge_base',
      isShow: false,
      onAdd: () => {
        setModalConfig({
          visible: true,
          title: '知识库',
          code: 'knowledge_base',
        })
      },
      children: null,
      showEdit: false,
    },
    {
      title: '文件上传',
      code: 'file_upload',
      isShow: false,
      onAdd: () => {
        setModalConfig({
          visible: true,
          title: '文件上传',
          code: 'file_upload',
        })
      },
      children: null,
    },
    {
      title: '文件上传',
      code: 'files',
      isShow: false,
      onAdd: () => {
        setModalConfig({
          visible: true,
          title: '文件上传',
          code: 'files',
        })
      },
      children: null,
    },
    {
      title: '模型配置',
      isShow: false,
      code: 'model',
      onAdd: () => {
        setModalConfig({
          visible: true,
          title: '模型配置',
          code: 'model',
        })
      },
      children: null,
    },
    {
      title: '数据库配置',
      isShow: false,
      code: 'database',
      onAdd: () => {
        setModalConfig({
          visible: true,
          title: '数据库配置',
          code: 'database',
        })
      },
      children: null,
    },
    {
      title: '事件信息',
      isShow: false,
      code: 'event_data',
      children: null,
    },
    {
      title: '事件范围',
      isShow: false,
      code: 'event_scope',
      children: null,
    },
    {
      title: '事件信息',
      isShow: false,
      code: 'event_form',
      children: null,
    },
    {
      title: '漏洞信息',
      isShow: false,
      code: 'loophole_form',
      children: null,
    },
  ]
  const [userAgentId, setUserAgentId] = useState<string>('')
  const [configList, setConfigList] = useState<any>({})
  const [fileList, setFileList] = useState<any[]>([])
  const [configItems, setConfigItems] =
    useState<ConfigItem[]>(initialConfigItems)
  const [eventInfo, setEventInfo] = useState<EventInfo>({
    event_data: '',
    event_scope: '',
  })
  const [modelInfo, setModelInfo] = useState<ModelInfo>({
    default_model: '',
    top_p: '',
    temperature: '',
    model_name: '',
    api_key: '',
    api_base: '',
  })
  const configListRef = useRef(configList)
  const userAgentIdRef = useRef(userAgentId)

  useEffect(() => {
    // 每次 userAgentId 更新时，更新 ref 的值
    userAgentIdRef.current = userAgentId
  }, [userAgentId])
  useEffect(() => {
    // 每次 configList 更新时，更新 ref 的值
    configListRef.current = configList
  }, [configList])
  useEffect(() => {
    onGetConfigValue()
  }, [mallItem])
  const Plugin: React.FC<{pluginList: PluginItem[]}> = ({pluginList}) => {
    return (
      <div className="plugin-box">
        {pluginList?.map((item: any, index: number) => {
          return (
            <div key={index} className="plugin-item">
              <div className="plugin-item-left">
                <img src={PluginIcon} alt="插件" />
                <div className="plugin-item-left-name">{item.name}</div>
              </div>
              <img
                className="delete-icon"
                src={DeleteIcon}
                alt="删除"
                onClick={() => {
                  handleDelete(item.code, 'plugin')
                }}
              />
            </div>
          )
        })}
      </div>
    )
  }
  const KnowledgeBase: React.FC<{knowledgeList: PluginItem[]}> = ({
    knowledgeList,
  }) => {
    return (
      <div className="plugin-box">
        {knowledgeList?.map((item: any, index: number) => {
          return (
            <div key={index} className="plugin-item">
              <div className="plugin-item-left">
                <img src={PluginIcon} alt="知识库" />
                <div className="plugin-item-left-name">{item.name}</div>
              </div>
              <img
                className="delete-icon"
                src={DeleteIcon}
                onClick={() => {
                  console.log('删除', item)

                  handleDelete(item.id, 'knowledge_base')
                }}
                alt="删除"
              />
            </div>
          )
        })}
      </div>
    )
  }
  const Database: React.FC<{databaseList: DataBaseItem}> = ({databaseList}) => {
    return (
      <div className="nested-items">
        <div className="nested-items-title">
          <span>数据库类型：</span>
          {databaseList?.type === 1 ? 'MySQL' : 'PostgreSQL'}
        </div>
        <div className="nested-items-title">
          <span>数据源名称: </span>
          {databaseList.name}
        </div>
        <div className="nested-items-title">
          <span>主机名称：</span>
          {databaseList.host}
        </div>
        <div className="nested-items-title">
          <span>端口：</span>
          {databaseList.port}
        </div>
        <div className="nested-items-title">
          <span>数据库名称: </span>
          {databaseList.dbName}
        </div>
        {databaseList.schm && (
          <div className="nested-items-title">
            <span>Schma：</span>
            {databaseList.schm}
          </div>
        )}
      </div>
    )
  }
  const Event: React.FC<{events: string}> = ({events}) => {
    return (
      <div className="event-box">
        {/* <Form form={form}>
          <Form.Item
            validateStatus={!isValidJson ? 'error' : ''}
            help={!isValidJson ? '请输入标准JSON格式' : ''}
          > */}
        <Input.TextArea
          defaultValue={events}
          bordered={false}
          autoSize={{minRows: 3, maxRows: 5}}
          placeholder={
            mallItem?.agentCode === 'safety_incident_response'
              ? '请输入事件信息'
              : '请输入标准JSON格式的事件信息'
          }
          onChange={e => {
            searchChange('event_data', e.target.value)
          }}
        />
        {/* </Form.Item>
        </Form> */}
      </div>
    )
  }
  const EventScope: React.FC<{event: string}> = ({event}) => {
    return (
      <div className="event-scope">
        <Select
          allowClear
          placeholder="请选择事件范围"
          defaultValue={event || ''}
          bordered={false}
          style={{width: '100%'}}
          onChange={v => searchChange('event_scope', v)}
          options={[
            {
              label: '病毒木马',
              value: 'virus',
            },
            {
              label: '暴力破解',
              value: 'brute_force',
            },
            {
              label: '端口扫描',
              value: 'port_scan',
            },
            {
              label: '反弹Shell',
              value: 'reverse_shell',
            },
            {
              label: '本地提权',
              value: 'local_empowerment',
            },
            {
              label: '命令行',
              value: 'cmd_line',
            },
            {
              label: '信息泄露',
              value: 'info_leak',
            },
          ]}
        />
      </div>
    )
  }
  const EventForm: React.FC = () => {
    return (
      <div className="event-form">
        <Form ref={formRef} name="basic" autoComplete="off">
          <Form.Item
            // label="事件名称"
            name="event_name"
            rules={[{required: true, message: '请输入事件名称'}]}
          >
            <Input
              className="event-form-item"
              bordered={false}
              placeholder="请输入事件名称"
            />
          </Form.Item>
          <Form.Item
            // label="事件介绍"
            name="event_desc"
            rules={[{required: true, message: '请输入事件介绍'}]}
          >
            <Input.TextArea
              className="event-form-item"
              bordered={false}
              autoSize={{minRows: 3, maxRows: 5}}
              placeholder="请输入事件介绍"
            />
          </Form.Item>
          <Form.Item
            // label="关键词"
            name="keyword"
            rules={[{required: true, message: '请输入关键词'}]}
          >
            <Input
              className="event-form-item"
              bordered={false}
              placeholder="请输入关键词"
            />
          </Form.Item>
          <Form.Item
            // label="事件详情"
            name="event_detail"
            rules={[{required: true, message: '请输入事件详情'}]}
          >
            <Input.TextArea
              className="event-form-item"
              bordered={false}
              autoSize={{minRows: 3, maxRows: 5}}
              placeholder="请输入事件详情"
            />
          </Form.Item>
        </Form>
      </div>
    )
  }
  const LoopholeForm: React.FC = () => {
    return (
      <div className="event-form">
        <Form ref={formRef} name="basic" autoComplete="off">
          <Form.Item
            name="riskName"
            // rules={[{required: true, message: '请输入漏洞名称'}]}
          >
            <Input
              className="event-form-item"
              bordered={false}
              placeholder="请输入漏洞名称"
            />
          </Form.Item>
          <Form.Item
            name="cveId"
            // rules={[{required: true, message: '请输入cve编号'}]}
          >
            <Input
              className="event-form-item"
              bordered={false}
              placeholder="请输入cve编号"
            />
          </Form.Item>
          <Form.Item
            name="url"
            rules={[{required: true, message: '请输入漏洞地址url'}]}
          >
            <Input.TextArea
              className="event-form-item"
              bordered={false}
              autoSize={{minRows: 3, maxRows: 5}}
              placeholder="请输入漏洞地址url"
            />
          </Form.Item>
        </Form>
      </div>
    )
  }
  const FileUpload: React.FC<{fileList: PluginItem[]}> = ({fileList}) => {
    return (
      <div className="plugin-box">
        {fileList?.map((item: any, index: number) => {
          return (
            <div key={index} className="plugin-item">
              <div className="plugin-item-left">
                <img src={PluginIcon} alt="文件" />
                <div className="plugin-item-left-name">
                  <div className="key">{item.key}</div>
                  <div className="size">{item.size}</div>
                </div>
              </div>
              {/* <img className="delete-icon" src={DeleteIcon} alt="删除" /> */}
            </div>
          )
        })}
      </div>
    )
  }
  // 事件研判-表单更新时触发
  const searchChange = (type: string, v: any): void => {
    setEventInfo(prevState => ({
      ...prevState,
      [type]: v,
    }))
  }
  // 添加获取配置项内容的函数
  const getConfigItemContent = (
    item: ConfigItem,
    configList: any,
    pluginList: PluginItem[],
  ) => {
    switch (item.code) {
      case 'plugin':
        return pluginList?.length > 0 ? (
          <Plugin pluginList={pluginList} />
        ) : null
      case 'knowledge_base':
        return configList.knowledge_base?.length > 0 ? (
          <KnowledgeBase knowledgeList={configList.knowledge_base} />
        ) : null
      case 'model':
        return configList.model && Object.keys(configList.model).length > 0 ? (
          <div className="nested-items">
            <div className="nested-items-title">
              <span>模型配置：</span>
              {configList.model.default_model === 'false'
                ? '外部模型'
                : '内部模型'}
            </div>
            {configList.model.model_name && (
              <div className="nested-items-title">
                <span>模型名称：</span>
                {configList.model.model_name}
              </div>
            )}
            {configList.model.default_model === 'false' && (
              <div className="nested-items-title">
                <span>api key：</span>
                {configList.model.api_key}
              </div>
            )}
            {configList.model.default_model === 'false' && (
              <div className="nested-items-title">
                <span>url：</span>
                {configList.model.api_base}
              </div>
            )}
            <div className="nested-items-title">
              <span>top_p: </span>
              {configList.model.top_p}
            </div>
            <div className="nested-items-title">
              <span>temperature：</span>
              {configList.model.temperature}
            </div>
          </div>
        ) : null
      case 'database':
        return configList.database &&
          Object.keys(configList.database).length > 0 ? (
          <Database databaseList={configList.database} />
        ) : null
      case 'event_data':
        return <Event events={configList.event_data} />
      case 'event_scope':
        return <EventScope event={configList.event_scope} />
      case 'event_form':
        return <EventForm />
      case 'file_upload':
        return configList.file_upload?.length > 0 ? (
          <FileUpload fileList={configList.file_upload} />
        ) : null
      case 'files':
        return configList.files?.length > 0 ? (
          <FileUpload fileList={configList.files} />
        ) : null
      case 'loophole_form':
        return <LoopholeForm />
      // 可以在这里添加其他配置项的处理逻辑
      default:
        return null
    }
  }
  // 获取配置项值
  const onGetConfigValue = async () => {
    try {
      const res = await queryAgentConfigValue(mallItem.id)
      if (res && res.code === 0) {
        const configList = JSON.parse(res.data?.configJson)
        // 获取所有得配置参数
        const configCodes = Object.keys(configList).filter(
          key => configList[key] !== null && configList[key] !== undefined,
        )
        const newConfigItems = configItems.map(item => ({
          ...item,
          isShow: configCodes.includes(item.code),
          children: getConfigItemContent(item, configList, configList.plugin),
          onEdit:
            item.code === 'model'
              ? () => {
                  setModalConfig({
                    visible: true,
                    title: '模型配置',
                    code: 'model',
                  })
                }
              : undefined,
          showEdit:
            item.code === 'model' &&
            configList.model &&
            Object.keys(configList.model).length > 0,
        }))
        setModelInfo(configList.model)
        setConfigList(configList)
        setUserAgentId(res.data?.id)
        setConfigItems(newConfigItems)
      }
    } catch (error) {
      message.error('获取配置值失败')
    }
  }
  // 添加 modal 关闭处理函数
  const handleModalClose = () => {
    setModalConfig(prev => ({...prev, visible: false}))
  }
  // 调用保存配置得接口
  const onSaveConfig = async (params: SaveConfigParams, successMsg: string) => {
    try {
      const res = await saveConfig(params)
      if (res && res.code === 0) {
        message.success(successMsg)
      }
    } catch (error) {
      message.error('保存失败')
    } finally {
      // 关闭 modal
      handleModalClose()
    }
  }
  const getFileList = (values: any) => {
    // 假设 configList.files 是原有文件数组，values 是新上传的文件数组
    const oldFiles = Array.isArray(configList.files) ? configList.files : []
    const newFiles = Array.isArray(values) ? values : [values]

    // 合并，最新的在后面
    const allFiles = [...oldFiles, ...newFiles]

    // 只保留每种类型最新的那一个
    const fileTypeMap: Record<string, any> = {}
    for (let i = 0; i < allFiles.length; i++) {
      const file = allFiles[i]
      // 判断类型
      const ext = (file.key || file.name || '').split('.').pop()?.toLowerCase()
      if (ext === 'xlsx' || ext === 'json') {
        // 后面的会覆盖前面的，保证最新
        fileTypeMap[ext] = {...file}
      }
    }

    // 最终只保留最新的 xlsx 和 json
    const files = Object.values(fileTypeMap)
    return files
  }
  // 修改 modal 确认处理函数
  const handleModalOk = async (values?: any) => {
    let params: SaveConfigParams
    const files = getFileList(values)
    // 根据不同的 code 处理不同的提交逻辑
    switch (modalConfig.code) {
      case 'plugin':
        console.log('Plugin config submitted')
        break
      case 'model':
        params = {
          id: userAgentId,
          configJson: {
            model: {
              ...values,
              streaming: true,
            },
          },
        }
        setModelInfo(values)
        await onSaveConfig(params, '模型配置添加成功')
        break
      case 'database':
        params = {
          id: userAgentId,
          configJson: {
            database: {
              ...values,
              id: configList.database?.id || null,
            },
          },
        }
        await onSaveConfig(params, '数据库配置添加成功')
        break
      case 'files':
        params = {
          id: userAgentId,
          configJson: {
            files: files as any,
          },
        }
        await onSaveConfig(params, '文件上传成功')
        break
      case 'file_upload':
        console.log('File upload config submitted', values)
        setFileList(values)
        setConfigItems(prevConfigItems =>
          prevConfigItems.map(item => {
            if (['file_upload', 'files'].includes(item.code)) {
              // 这里可以根据实际需求修改 children 的值
              return {
                ...item,
                children: <FileUpload fileList={values} />,
              }
            }
            return item
          }),
        )
        break
      default:
        break
    }
    // 提交成功后更新配置项
    if (!['file_upload'].includes(modalConfig.code)) {
      onGetConfigValue()
    }
  }
  const handleEventBtnClick = async (agentCode: string) => {
    if (!modelInfo?.top_p) {
      message.error('请先配置模型')
      return
    }
    if (['leak_info_process', 'risk_judge'].includes(agentCode)) {
      formRef.current.validateFields().then((values: any) => {
        if (
          agentCode === 'risk_judge' &&
          values.riskName === undefined &&
          values.cveId === undefined
        ) {
          message.error('漏洞名称和 CVE 编号至少需要一个有值')
          return
        }
        onEventClick(values, agentCode)
      })
    } else if (
      ['warning_deduplication', 'loophole_aggregation'].includes(agentCode)
    ) {
      if (fileList.length === 0) {
        message.error('请先上传文件')
        return
      }
      onEventClick(fileList[0], agentCode)
    } else {
      console.log('eventInfo', eventInfo)

      if (eventInfo.event_data === '') {
        message.error('请输入事件信息')
        return
      }
      try {
        eventInfo.event_data = JSON.parse(eventInfo.event_data)
      } catch (err) {
        message.error('输入的事件信息不是有效的 JSON 格式')
        return
      }
      if (
        eventInfo.event_scope === '' &&
        mallItem.agentCode === 'safety_incident_analysis'
      ) {
        message.error('请选择事件范围')
        return
      }
      onEventClick(eventInfo, agentCode)
    }
  }
  // 编排删除插件或者知识库
  const handleDelete = async (code: string, type: string) => {
    console.log(userAgentIdRef, 'userAgentIdRef')

    try {
      const params: {id: string; configJson: any} = {
        id: userAgentIdRef.current,
        configJson: {
          // 由于 configListRef 是一个 Ref 对象，需要访问其 current 属性，并且使用类型断言来解决索引问题
          [type]: configListRef.current?.[type]?.filter((itm: any) => {
            if (type === 'plugin') {
              return itm.code !== code
            } else {
              return itm.id !== code
            }
          }),
        },
      }
      console.log(params, 'params')

      const res = await saveConfig(params)
      if (res && res.code === 0) {
        message.success('保存成功')
        onGetConfigValue()
      }
    } catch (error) {
      console.log(error, 'error')
      message.error('保存失败')
    } finally {
      // onClose()
    }
  }
  return (
    <div className="sidebar-box">
      <h3 className="sidebar-title">编排</h3>
      <div className="sidebar-content">
        {configItems
          .filter(item => item.isShow)
          .map((item, index) => {
            return (
              <div key={index}>
                <ConfigPanel items={[item]} />
              </div>
            )
          })}
        {[
          'leak_info_process',
          'safety_incident_analysis',
          'safety_incident_response',
          'loophole_aggregation',
          'risk_judge',
          'warning_deduplication',
        ].includes(mallItem.agentCode) && (
          <div
            className="event-btn"
            onClick={() => {
              handleEventBtnClick(mallItem.agentCode)
            }}
          >
            {mallItem.agentCode === 'loophole_aggregation' && '开始聚合'}
            {mallItem.agentCode === 'safety_incident_response' && '开始响应'}
            {[
              'leak_info_process',
              'safety_incident_analysis',
              'risk_judge',
            ].includes(mallItem?.agentCode) && '研判'}
            {mallItem.agentCode === 'warning_deduplication' && '开始任务'}
          </div>
        )}
      </div>
      {modalConfig.code === 'plugin' && (
        <PluginModal
          visible={modalConfig.visible}
          title={modalConfig.title}
          code={modalConfig.code}
          userAgentId={userAgentId}
          pluginCode={configList.plugin}
          onOk={() => {
            handleModalOk()
          }}
          onClose={handleModalClose}
        />
      )}
      {modalConfig.code === 'model' && (
        <ModelModal
          visible={modalConfig.visible}
          title={modalConfig.title}
          code={modalConfig.code}
          initialValues={configList.model}
          onOk={(values: any) => {
            handleModalOk(values)
          }}
          onClose={handleModalClose}
        />
      )}
      {modalConfig.code === 'knowledge_base' && (
        <KnowledgeBaseModal
          visible={modalConfig.visible}
          title={modalConfig.title}
          code={modalConfig.code}
          userAgentId={userAgentId}
          knowledgeBase={configList.knowledge_base}
          onOk={() => {
            handleModalOk()
          }}
          onClose={handleModalClose}
        />
      )}
      {modalConfig.code === 'database' && (
        <SqlModal
          visible={modalConfig.visible}
          initialValues={configList.database}
          onOk={async (values: any) => {
            await handleModalOk(values)
          }}
          onClose={handleModalClose}
        />
      )}
      {modalConfig.code === 'file_upload' && (
        <FileUploadModal
          agentCode={mallItem?.agentCode}
          visible={modalConfig.visible}
          onClose={handleModalClose}
          onOk={(values: any) => {
            handleModalOk(values)
          }}
          isMultiple={false}
        />
      )}
      {modalConfig.code === 'files' && (
        <FileUploadModal
          agentCode={mallItem?.agentCode}
          visible={modalConfig.visible}
          initialValues={configList.files || []}
          onClose={handleModalClose}
          onOk={(values: any) => {
            handleModalOk(values)
          }}
          isMultiple={true}
        />
      )}
    </div>
  )
}

export default Sidebar